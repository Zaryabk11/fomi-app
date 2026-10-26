import MediaTile from "./MediaTile";
import SkeletonTile from "./SkeletonTile";

export default function MediaGrid({ generationId, items, skeleton, onOpen, priority = false }) {
  return (
    <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4">
      {skeleton
        ? Array.from({ length: skeleton.count }, (_, i) => (
            <li key={i}>
              <SkeletonTile ratio={skeleton.ratio} />
            </li>
          ))
        : items.map((item, index) => (
            <li key={item.id}>
              <MediaTile item={item} generationId={generationId} index={index} onOpen={onOpen} priority={priority} />
            </li>
          ))}
    </ul>
  );
}
