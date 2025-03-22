import React from "react";
import { Card } from "../ui/card";

const Message = ({ text, sender }) => {
  return (
    <div
      className={`my-2 ${
        sender === "user" ? "flex justify-end" : "flex justify-start"
      }`}
    >
      <Card
        className={`p-3 max-w-[80%] ${
          sender === "user"
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-800"
        } rounded-lg shadow-sm break-words`}
      >
        {text.split("\n").map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < text.split("\n").length - 1 && <br />}
          </React.Fragment>
        ))}
      </Card>
    </div>
  );
};

export default Message;