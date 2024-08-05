import { Upload, Send, Database, FileText } from 'lucide-react';
import Card, {
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';
import Button from '@/components/ui/button';
import ScrollArea from '@/components/ui/scroll-area';
import Input from '@/components/ui/input';
import { useEffect, useState } from 'react';
interface Message {
  text: string;
  sender: string;
}
interface SearchResult {
  filename: string;
  content: string;
}
interface Pdf {
  _id: string;
  filename: string;
}
const CivilEngineeringPDFSystem = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pdfList, setPdfList] = useState([]);

  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    try {
      const response = await fetch('/pdfs');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPdfList(data);
    } catch (error) {
      console.error('Error al obtener la lista de PDFs:', error);
    }
  };

  const handleFileUpload: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('pdf', file);
      try {
        const response = await fetch('/upload', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log(result);
        setMessages((prev) => [
         ...prev,
          {
            text: `PDF "${file.name}" cargado y procesado con éxito.`,
            sender: 'ystem',
          },
        ]);
        fetchPDFs();
      } catch (error) {
        console.error('Error al subir o procesar el PDF:', error);
        setMessages((prev) => [
         ...prev,
          {
            text: 'Error al subir o procesar el PDF. Por favor, intente de nuevo.',
            sender: 'ystem',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { text: input, sender: 'user' }]);
    setInput('');

    try {
      const response = await fetch(`/search?q=${encodeURIComponent(input)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const answer = processSearchResults(data);
      setMessages((prev) => [...prev, { text: answer, sender: 'bot' }]);
    } catch (error) {
      console.error('Error al buscar en la base de datos:', error);
      setMessages((prev) => [
        ...prev,
        {
          text: 'Lo siento, hubo un error al procesar tu pregunta. Por favor, intenta de nuevo.',
          sender: 'bot',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const processSearchResults = (results: SearchResult[]) => {
    if (results.length === 0) {
      return 'Lo siento, no encontré información relevante en la base de datos de PDFs.';
    }

    const topResult = results[0];
    return `Basado en la información encontrada en el PDF "${
      topResult.filename
    }": ${topResult.content.substring(0, 200)}...`;
  };

  return (
    <div className="flex flex-col h-screen">
      <Card className="flex-grow overflow-hidden">
        <CardHeader className="bg-blue-500 text-white font-bold flex justify-between items-center">
          <span>Asistente Civil Virtual</span>
          <div>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="pdf-upload"
            />
            <label htmlFor="pdf-upload">
              <Button 
               className="bg-white text-blue-500">
                <Upload className="h-4 w-4 mr-2" />
                Subir PDF
              </Button>
            </label>
          </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <div className="flex h-full">
            <ScrollArea className="w-3/4 pr-4 border-r">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.sender === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-100 text-blue-900'
                        : message.sender === 'system'
                        ? 'bg-green-100 text-green-900'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            <ScrollArea className="w-1/4 pl-4" children={undefined} />
  <h3 className="font-bold mb-2">PDFs Procesados</h3>
  {pdfList.map((pdf: Pdf) => (
    <div key={pdf._id} className="mb-4 p-2 bg-gray-100 rounded">
      <h4 className="font-semibold">{pdf.filename}</h4>
      <div className="flex space-x-2 mt-1">
        <FileText className="h-4 w-4" aria-label="Texto extraído" />
        <Database className="h-4 w-4" aria-label="Entidades extraídas" />
      </div>
    </div>
  ))}
</ScrollArea>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              aria-placeholder="Haz una pregunta sobre ingeniería civil..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              className="bg-blue-500 text-white"
              aria-disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CivilEngineeringPDFSystem;
