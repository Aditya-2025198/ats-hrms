"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

function DropdownHover({ title, items }: { title: string; items: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center hover:text-gray-900">
        {title} <ChevronDown className="ml-1 h-4 w-4" />
      </button>

      {open && (
        <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          {items.map((item, index) => (
            <a
              key={index}
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default DropdownHover;
