export class DragGhostComponent {
  init(params) {
    // Dummy element — AG Grid appends and positions this, but it's hidden
    this.eGui = document.createElement('div');
    this.eGui.style.display = 'none';

    // Real ghost — we append to body and position ourselves
    const doc = wwLib.getFrontDocument();
    this.eReal = doc.createElement('div');
    this.eReal.className = 'ag-dnd-ghost ag-unselectable custom-drag-ghost';
    this.eReal.style.cssText = `
      position: fixed; z-index: 99999; pointer-events: none;
      padding: 8px 16px; border-radius: 4px;
      background: var(--ag-background-color, #fff);
      border: 1px solid var(--ag-border-color, #babfc7);
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      font-size: 13px; white-space: nowrap;
      display: flex; align-items: center; gap: 8px;
    `;

    this.eIconSpan = doc.createElement('span');
    this.eIconSpan.className = 'ag-dnd-ghost-icon';
    this.eReal.appendChild(this.eIconSpan);

    this.eLabelSpan = doc.createElement('span');
    this.eLabelSpan.className = 'ag-dnd-ghost-label';
    this.eReal.appendChild(this.eLabelSpan);

    doc.body.appendChild(this.eReal);

    this._onMouseMove = (e) => {
      this.eReal.style.left = (e.clientX + 16) + 'px';
      this.eReal.style.top = (e.clientY + 16) + 'px';
    };
    doc.addEventListener('mousemove', this._onMouseMove);
  }

  getGui() { return this.eGui; }

  setLabel(label) {
    if (this.eLabelSpan) this.eLabelSpan.textContent = label;
  }

  setIcon(iconName, shake) {
    // Row dragging icon is typically 'move' — kept minimal for simplicity
  }

  destroy() {
    const doc = wwLib.getFrontDocument();
    doc.removeEventListener('mousemove', this._onMouseMove);
    this.eReal?.remove();
  }
}
