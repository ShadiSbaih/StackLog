import React from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {
  const inputRef = React.useRef(null);
  const [previewUrl, setPreviewUrl] = React.useState(image);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      //update preview url
      setImage(file);

      //generate preview url
      const preview = URL.createObjectURL(file);
      if (setPreview) {
        setPreview(preview);
      }
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);

    if (setPreview) {
      setPreview(null);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        ref={inputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />
      {!image ? (
        <div className="w-20 h-20 flex items-center justify-center bg-sky-50 rounded-full relative cursor-pointer">
          <LuUser className="text-4xl text-sky-500" />
          <button
            onClick={onChooseFile}
            type="button"
            className={`w-8 h-8 flex items-center justify-center
                      bg-linear-to-r from-sky-500 to-cyan-400 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer  `}
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img src={preview || previewUrl} alt="preview image" 
          className="w-20 h-20 rounded-full object-cover" />
          <button onClick={handleRemoveImage} type="button"
           className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer">
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
