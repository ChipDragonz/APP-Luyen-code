import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, CheckCircle2, ArrowRight } from 'lucide-react';

function SortableItem({ id, content }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="sortable-item">
      <div className="drag-handle" {...attributes} {...listeners}>
        <GripVertical size={20} />
      </div>
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: 'inherit' }}>
        {content}
      </pre>
    </div>
  );
}

export default function SortMode({ exercise, onComplete }) {
  const [items, setItems] = useState(exercise.blocks);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    // Check if the current order matches the correct order
    const currentOrder = items.map(item => item.id);
    const isMatch = currentOrder.length === exercise.correctOrder.length && 
                    currentOrder.every((val, index) => val === exercise.correctOrder[index]);
    setIsCorrect(isMatch);
  }, [items, exercise]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <div className="mode-badge" style={{ margin: 0 }}>Chế độ 2: Sắp xếp Logic</div>
        {exercise.filePath && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
            📄 {exercise.filePath}
          </div>
        )}
      </div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{exercise.title}</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{exercise.instruction}</p>

      <div style={{ backgroundColor: 'var(--code-bg)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={items.map(i => i.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <SortableItem key={item.id} id={item.id} content={item.content} />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isCorrect ? 'var(--success-color)' : 'var(--text-color)' }}>
          {isCorrect && <CheckCircle2 size={20} />}
          <span>{isCorrect ? 'Thứ tự chính xác! Làm tốt lắm.' : 'Kéo thả các khối code để sắp xếp lại cho đúng.'}</span>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={onComplete}
          disabled={!isCorrect}
        >
          Thử Thách Tiếp Theo
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
