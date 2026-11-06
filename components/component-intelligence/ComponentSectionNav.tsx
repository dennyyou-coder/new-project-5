/** In-page section links, kept on screen while reading a long profile. */
export function ComponentSectionNav() {
  return (
    <div className="detail-sticky-nav">
      <div className="insights-page-container">
        <nav className="component-intelligence-nav" aria-label="Component profile sections">
          <a href="#system-role">System role</a><a href="#architectures">Architectures</a><a href="#specifications">Specifications</a><a href="#applications">Applications</a><a href="#compatibility">Compatibility</a><a href="#failure-modes">Failure modes</a><a href="#families">Families</a><a href="#procurement">Procurement</a><a href="#engineering">Engineering</a><a href="#standards">Standards</a><a href="#developments">Developments</a><a href="#sources">Sources</a>
        </nav>
      </div>
    </div>
  );
}
