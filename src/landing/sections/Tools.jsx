export default function Tools() {
    const tools = [
      { name: "React", img: "/tools/react.png" },
      { name: "FastAPI", img: "/tools/fastapi.png" },
      { name: "OpenCV", img: "/tools/opencv.png" },
      { name: "yt-dlp", img: "/tools/ytdlp.png" },
      { name: "Cloudinary", img: "/tools/cloudinary.png" },
    ];
  
    return (
      <div className="overflow-x-auto whitespace-nowrap py-6 bg-indigo-50">
        <div className="flex gap-10 px-6">
          {tools.map((tool, i) => (
            <div key={i} className="flex items-center gap-2">
              <img src={tool.img} className="w-8" />
              <span>{tool.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }