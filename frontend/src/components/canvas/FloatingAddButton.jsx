import { useUiStore } from '@store/uiStore'

export function FloatingAddButton() {
  const { isWizardOpen, toggleWizard } = useUiStore()

  return (
    <button
      type="button"
      onClick={toggleWizard}
      className={`floating-add-btn group ${isWizardOpen ? 'floating-add-btn--active' : ''}`}
      title={isWizardOpen ? 'Cerrar panel' : 'Agregar nodo / configurar flujo'}
      aria-label="Abrir panel de nodos"
    >
      <span className={`floating-add-btn__icon ${isWizardOpen ? 'rotate-45' : ''}`}>
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </span>
      <span className="floating-add-btn__label">
        {isWizardOpen ? 'Cerrar' : 'Agregar'}
      </span>
    </button>
  )
}
