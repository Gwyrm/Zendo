import React, { useState } from 'react';
import { Board } from './components/Board';
import { Board as BoardType, BoardTemplate } from './types';
import { mockBoard, defaultMembers, predefinedLabels } from './data/mockData';
import { boardTemplates } from './data/boardTemplates';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [boards, setBoards] = useLocalStorage<BoardType[]>('kanban-boards', [mockBoard]);
  const [currentBoardId, setCurrentBoardId] = useLocalStorage<string>('current-board-id', mockBoard.id);

  const currentBoard = boards.find(board => board.id === currentBoardId) || boards[0];

  const handleUpdateBoard = (updatedBoard: BoardType) => {
    setBoards(prevBoards => 
      prevBoards.map(board => 
        board.id === updatedBoard.id ? updatedBoard : board
      )
    );
  };

  const handleSelectBoard = (board: BoardType) => {
    setCurrentBoardId(board.id);
  };

  const handleCreateBoard = (template?: BoardTemplate) => {
    const newBoard: BoardType = {
      id: Date.now().toString(),
      title: template ? `${template.name} Board` : 'New Board',
      description: template?.description || 'A new Kanban board',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      members: defaultMembers,
      createdAt: new Date(),
      updatedAt: new Date(),
      settings: {
        allowComments: true,
        allowVoting: true,
        cardAging: false,
      },
      activityLog: [],
      lists: template ? template.lists.map((listTemplate, index) => ({
        id: `${Date.now()}-${index}`,
        title: listTemplate.title,
        boardId: Date.now().toString(),
        position: listTemplate.position,
        wipLimit: listTemplate.wipLimit,
        cards: [],
      })) : [
        {
          id: `${Date.now()}-1`,
          title: 'To Do',
          boardId: Date.now().toString(),
          position: 0,
          cards: [],
        },
        {
          id: `${Date.now()}-2`,
          title: 'In Progress',
          boardId: Date.now().toString(),
          position: 1,
          cards: [],
        },
        {
          id: `${Date.now()}-3`,
          title: 'Done',
          boardId: Date.now().toString(),
          position: 2,
          cards: [],
        },
      ],
    };

    setBoards(prevBoards => [...prevBoards, newBoard]);
    setCurrentBoardId(newBoard.id);
  };

  return (
    <div className="App">
      <Board 
        board={currentBoard}
        onUpdateBoard={handleUpdateBoard}
        boards={boards}
        onSelectBoard={handleSelectBoard}
        onCreateBoard={handleCreateBoard}
      />
    </div>
  );
}

export default App;