import { useState, ReactNode } from 'react';
import './code-editor.css'; 

interface SplitPaneProps {
  left: ReactNode;
  right: ReactNode;
}

const SplitPane = ({ left, right }: SplitPaneProps) => {
  const [dividerPosition, setDividerPosition] = useState(50);

  const handleMouseMove = (event: MouseEvent) => {
    setDividerPosition(event.clientX / window.innerWidth * 100);
  }

  return (
    <div className="SplitPane">
      <div 
        className="Pane" 
        style={{ width: `${dividerPosition}%` }}
      >
        {left}
      </div>
      <div
        className="Divider"
        onMouseDown={event => {
          event.preventDefault();
          window.addEventListener('mousemove', handleMouseMove);
          window.addEventListener('mouseup', () => {
            window.removeEventListener('mousemove', handleMouseMove);
          });
        }}
      />
      <div 
        className="Pane" 
        style={{ width: `${100 - dividerPosition}%` }}
      >
        {right}
      </div>
    </div>
  );
}

export default SplitPane;
