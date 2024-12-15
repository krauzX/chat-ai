import { useState } from "react";
import { Assistant } from "./assistants/googleai";
import { Loader } from "./components/Loader/Loader";
import { Chat } from "./components/Chat/Chat";
import { Controls } from "./components/Controls/Controls";
import styles from "./App.module.css";

function App() {
  const assistant = new Assistant();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function addMessage(message) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  async function simulateTyping(text) {
    for (let i = 0; i < text.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 10)); // Adjust delay as needed
      //This line is crucial for updating the UI during the typing simulation.
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const lastAssistantMessage = updatedMessages.findLast(
          (msg) => msg.role === "assistant"
        );
        if (lastAssistantMessage) {
          lastAssistantMessage.content = text.substring(0, i + 1);
        }
        return updatedMessages;
      });
    }
  }

  async function handleContentSend(content) {
    addMessage({ content, role: "user" });
    setIsLoading(true);
    try {
      const result = await assistant.chat(content, messages);
      simulateTyping(result);
      addMessage({ content: result, role: "assistant" });
    } catch (error) {
      console.log(error);

      addMessage({
        content: "Sorry, I couldn't process your request. Please try again!",
        role: "system",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.App}>
      {isLoading && <Loader />}
      <header className={styles.Header}>
        <img className={styles.Logo} src="/chat-bot.png" />
        <h2 className={styles.Title}>AI Chatbot</h2>
      </header>
      <div className={styles.ChatContainer}>
        <Chat messages={messages} />
      </div>
      <Controls isDisabled={isLoading} onSend={handleContentSend} />
    </div>
  );
}

export default App;
