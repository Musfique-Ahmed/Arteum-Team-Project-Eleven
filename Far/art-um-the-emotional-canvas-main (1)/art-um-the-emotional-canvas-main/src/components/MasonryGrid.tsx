import ArtworkCard, { Artwork } from "./ArtworkCard";

interface MasonryGridProps {
  artworks: Artwork[];
  onArtworkClick: (artwork: Artwork) => void;
}

const MasonryGrid = ({ artworks, onArtworkClick }: MasonryGridProps) => {
  // Split artworks into columns for masonry effect
  // 2 columns for mobile, 3 for tablet, 4 for desktop
  const getColumns = (numCols: number) => {
    const columns: Artwork[][] = Array.from({ length: numCols }, () => []);
    artworks.forEach((artwork, i) => {
      columns[i % numCols].push(artwork);
    });
    return columns;
  };

  const twoColumns = getColumns(2);
  const threeColumns = getColumns(3);
  const fourColumns = getColumns(4);
  const fiveColumns = getColumns(5);
  const sixColumns = getColumns(6);

  const renderColumn = (column: Artwork[], colIndex: number, baseIndex: number) => (
    <div key={colIndex} className={`flex-1 flex flex-col gap-3 lg:gap-4 ${colIndex % 2 === 1 ? 'pt-8 lg:pt-12' : ''}`}>
      {column.map((artwork, index) => (
        <ArtworkCard
          key={artwork.id}
          artwork={artwork}
          index={baseIndex + index}
          onClick={onArtworkClick}
        />
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile: 2 columns */}
      <div className="flex gap-3 px-4 md:hidden">
        {twoColumns.map((column, i) => renderColumn(column, i, i))}
      </div>

      {/* Tablet: 3 columns */}
      <div className="hidden md:flex lg:hidden gap-4 px-4">
        {threeColumns.map((column, i) => renderColumn(column, i, i))}
      </div>

      {/* Desktop: 4 columns */}
      <div className="hidden lg:flex xl:hidden gap-5">
        {fourColumns.map((column, i) => renderColumn(column, i, i))}
      </div>

      {/* Large Desktop: 5 columns */}
      <div className="hidden xl:flex 2xl:hidden gap-5">
        {fiveColumns.map((column, i) => renderColumn(column, i, i))}
      </div>

      {/* Extra Large Desktop: 6 columns */}
      <div className="hidden 2xl:flex gap-6">
        {sixColumns.map((column, i) => renderColumn(column, i, i))}
      </div>
    </>
  );
};

export default MasonryGrid;
