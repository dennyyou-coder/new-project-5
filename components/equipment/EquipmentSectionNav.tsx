/** In-page section links, kept on screen while reading a long profile. */
export function EquipmentSectionNav() {
  return (
    <div className="detail-sticky-nav">
      <div className="insights-page-container">
        <nav className="equipment-section-nav" aria-label="Equipment profile sections">
          <a href="#working-system">Working system</a>
          <a href="#equipment-types">Types</a>
          <a href="#performance-metrics">Metrics</a>
          <a href="#application-fit">Applications</a>
          <a href="#component-stack">Components</a>
          <a href="#representative-models">Models</a>
          <a href="#procurement">Procurement</a>
          <a href="#engineering">Engineering</a>
          <a href="#standards">Standards</a>
          <a href="#developments">Developments</a>
          <a href="#sources">Sources</a>
        </nav>
      </div>
    </div>
  );
}
