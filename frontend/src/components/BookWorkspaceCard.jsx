import React from 'react';
import { ArrowRight, BookMarked } from 'lucide-react';

const BookWorkspaceCard = ({ book, onOpen }) => {
  return (
    <button
      type="button"
      onClick={() => onOpen?.(book)}
      className="group flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-[rgba(212,166,58,0.14)] bg-[linear-gradient(180deg,rgba(10,18,36,0.98),rgba(8,14,27,0.98))] p-4 text-left shadow-[0_18px_40px_rgba(0,0,0,0.22)] transition-all hover:-translate-y-1 hover:border-[rgba(212,166,58,0.3)]"
    >
      <div className="relative overflow-hidden rounded-[1.35rem]">
        <img
          src={book.cover}
          alt={book.title}
          className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(7,16,31,0.88)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f3d58a]">
          {book.streakTag}
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold tracking-[-0.03em] text-[#fff8eb]">{book.title}</h3>
            <p className="mt-1 text-sm font-medium text-[#bba987]">{book.author}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[rgba(212,166,58,0.16)] bg-[rgba(15,26,46,0.96)] text-[#f3d58a]">
            <BookMarked size={18} />
          </div>
        </div>

        <p className="mt-4 text-sm leading-7 text-[#c8b99a]">{book.summary}</p>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8e8164]">
            <span>{book.progress}% read</span>
            <span>{book.lastRead}</span>
          </div>
          <div className="h-2.5 rounded-full bg-[#16233e]">
            <div
              className="h-2.5 rounded-full bg-[linear-gradient(90deg,#efc45d,#c8941d)]"
              style={{ width: `${book.progress}%` }}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm font-medium text-[#a99a7d]">{book.goal}</p>
          <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(212,166,58,0.1)] px-4 py-2 text-sm font-semibold text-[#f3d58a]">
            Continue Reading
            <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </button>
  );
};

export default BookWorkspaceCard;
