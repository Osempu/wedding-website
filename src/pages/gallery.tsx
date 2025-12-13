import Masonry from "../components/Components/Masonry/Masonry";
import FileUpload from "../../components/comp-547";

function generateRandomPhotos(
  count: number
): Array<{ id: string; img: string; url: string; height: number }> {
  return Array.from({ length: count }, (_, i) => ({
    id: (i + 1).toString(),
    img: `https://picsum.photos/id/${Math.floor(
      Math.random() * 1000
    )}/600/900?grayscale`,
    url: `https://example.com/photo${i + 1}`,
    height: Math.floor(Math.random() * 500) + 200, // height between 200 and 700
  }));
}

const items = generateRandomPhotos(20);

function GalleryPage() {
  return (
    <>
      <div className="flex align-center justify-center p-5 mb-5">
        <h1 className="text-3xl">Album</h1>
      </div>

      <div className="flex flex-col p-5 mx-auto md:w-6/12 sm:w-full">
        <h4 className="mx-auto">Add your photos!</h4>
        <FileUpload />
      </div>

      <div className="flex w-5/6 align-center justify center ml-auto mr-auto">
        <Masonry
          items={items}
          ease="back.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="top"
          scaleOnHover={true}
          hoverScale={0.95}
          blurToFocus={true}
          colorShiftOnHover={false}
        />
      </div>
    </>
  );
}

export default GalleryPage;
