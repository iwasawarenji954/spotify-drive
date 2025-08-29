type NowPlayingProps = {
  title: string;
  artist: string;
  album: string;
  imageUrl: string;
};

export default function NowPlaying({
  title,
  artist,
  album,
  imageUrl,
}: NowPlayingProps) {
  return (
    <section className="rounded-lg border border-foreground/15 p-4">
      <h2 className="font-medium mb-3">再生中</h2>
      <div className="flex items-center gap-4">
        <img
          src={imageUrl}
          alt="album art"
          width={64}
          height={64}
          className="rounded"
        />
        <div className="min-w-0">
          <div className="truncate font-semibold">{title}</div>
          <div className="truncate text-sm opacity-80">{artist}</div>
          <div className="truncate text-xs opacity-60">{album}</div>
        </div>
      </div>
    </section>
  );
}

