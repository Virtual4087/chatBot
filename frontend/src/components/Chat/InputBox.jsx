import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import { SendHorizonal, Loader2 } from "lucide-react";

const InputBox = ({ onSendMessage, isLoading, onStopResponse, isLoggedIn }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 4 * 24)}px`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end w-full max-w-7xl m-auto text-lg">
      <div className="relative flex-1 flex items-end">
        <textarea
          ref={textareaRef}
          placeholder={!isLoggedIn ? "Please log in to chat." : "Type a message..."}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={isLoading || !isLoggedIn}
          readOnly={!isLoggedIn}
          className="w-full p-4 rounded-xl border border-gray-300 resize-none overflow-y-auto disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            minHeight: "48px",
            maxHeight: "96px",
            lineHeight: "24px",
          }}
          rows={1}
        />
      </div>
      {isLoading ? (
        <Button
          type="button"
          onClick={onStopResponse}
          variant="destructive"
          className="h-10 w-10 p-0 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      ) : (
        <Button
          type="submit"
          disabled={isLoading || !isLoggedIn}
          className="h-10 w-10 p-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:cursor-not-allowed"
        >
          <SendHorizonal className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Button>
      )}
    </form>
  );
};

export default InputBox;