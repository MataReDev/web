import React, { useState, useContext, useEffect } from "react";
import makeRequest from "../Utils/RequestUtils";
import { toast } from "react-toastify";
import { AuthContext } from "../Auth/authContext";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, Modal } from "antd";
import ImgCrop from "antd-img-crop";
const chunkSize = 50 * 1024;

function UploadVideoPage() {
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [showProgressBar, setProgressBarVisibility] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false); // Add state for submit button

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [state, setState] = useState("Public"); // État pour la valeur sélectionnée
  const [progress, setProgress] = useState(0);
  const { user } = useContext(AuthContext);
  const toastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  };

  //-----------------------------UPLOAD VIDEO FILE ----------------

  const [files, setFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(null);
  const [lastUploadedFileIndex, setLastUploadedFileIndex] = useState(null);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setProgressBarVisibility(true);

    setFiles([...files, videoFile]);
  };

  function readAndUploadCurrentChunk() {
    const file = files[currentFileIndex];
    if (!file) {
      return;
    }
    const from = currentChunkIndex * chunkSize;
    const to = from + chunkSize;
    const blob = file.slice(from, to);
    const reader = new FileReader();
    reader.onload = (e) => uploadChunk(e.target.result);
    reader.readAsDataURL(blob);
  }

  function uploadChunk(data) {
    setProgressBarVisibility(true);
    setSubmitDisabled(true); // Disable submit button
    const file = files[currentFileIndex];
    const params = new URLSearchParams();
    params.set("name", file.name);
    params.set("size", file.size);
    params.set("currentChunkIndex", currentChunkIndex);
    params.set("totalChunks", Math.ceil(file.size / chunkSize));
    const headers = { "Content-Type": "application/octet-stream" };
    const url = "api/videos/uploadVideo?" + params.toString();

    makeRequest(url, "POST", headers, data, null, true).then((data) => {
      const file = files[currentFileIndex];
      const filesize = files[currentFileIndex].size;
      const chunks = Math.ceil(filesize / chunkSize) - 1;
      const isLastChunk = currentChunkIndex === chunks;
      setProgress(0);
      if (file.finalFilename) {
        setProgress(100);
      } else {
        const chunks = Math.ceil(file.size / chunkSize);

        setProgress(Math.round((currentChunkIndex / chunks) * 100));
      }
      if (isLastChunk) {
        setLastUploadedFileIndex(currentFileIndex);
        setCurrentChunkIndex(null);
        if (data !== null) {
          file.finalFilename = data.finalFileName;
          upload(data.path + data.finalFileName, filesize);
        } else {
          console.error("Error uploading video");
          setLastUploadedFileIndex(null);
          setCurrentChunkIndex(null);
          setFiles([]);
        }
      } else {
        setCurrentChunkIndex(currentChunkIndex + 1);
      }
    });
  }

  useEffect(() => {
    if (lastUploadedFileIndex === null) {
      return;
    }
    const isLastFile = lastUploadedFileIndex === files.length - 1;
    const nextFileIndex = isLastFile ? null : currentFileIndex + 1;
    setCurrentFileIndex(nextFileIndex);
  }, [lastUploadedFileIndex]);

  useEffect(() => {
    if (files.length > 0) {
      if (currentFileIndex === null) {
        setCurrentFileIndex(
          lastUploadedFileIndex === null ? 0 : lastUploadedFileIndex + 1
        );
      }
    }
  }, [files.length]);

  useEffect(() => {
    if (currentFileIndex !== null) {
      setCurrentChunkIndex(0);
    }
  }, [currentFileIndex]);

  useEffect(() => {
    if (currentChunkIndex !== null) {
      readAndUploadCurrentChunk();
    }
  }, [currentChunkIndex]);

  //---------------------------------------------------------------------------------------

  const upload = (videoPath, videoSize) => {
    setProgressBarVisibility(true);
    setSubmitDisabled(true); // Disable submit button

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video_path", videoPath);
    formData.append("video_size", videoSize);
    formData.append("thumbnail", thumbnailFile);
    formData.append("state", state);

    makeRequest(
      "api/videos/upload",
      "POST",
      null,
      formData,
      null,
      true,
      onUploadProgress
    )
      .then((data) => {
        if (data !== null) {
          if (user) {
            localStorage.setItem(
              "toastMessage",
              JSON.stringify({
                status: "success",
                message: `Video upload with success ${user.currentUser?.username} ! `,
              })
            );
            // Redirigez l'utilisateur vers la chaine
            window.location.href = `/channel/${user.currentUser?.username}`;
          }
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        // Masquer la barre de progression une fois la soumission terminée
        setProgressBarVisibility(false);
        setSubmitDisabled(false); // Enable submit button after submission
      });
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleThumbnailChange = (e) => {
    setThumbnailFile(e.target.files[0]);
  };

  const handleStateChange = (value) => {
    setState(value);
  };


  const onUploadProgress = (progressEvent) => {
    const progress = Math.round(
      (progressEvent.loaded / progressEvent.total) * 100
    );
    setProgress(progress);
  };

  // -------------- PREVIEW --------------- //

  const [previewOpen, setPreviewOpen] = useState(false);
  const [preview, setPreview] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [contentType, setContentType] = useState("");

  const handleCancel = () => setPreviewOpen(false);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreview(file.url || file.preview);
    setPreviewOpen(true);

    const isImage = file.type.startsWith("image/");
    setContentType(isImage ? "image" : "video");

    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  // -------------------------------------- //

  const [defaultFileList, setDefaultFileList] = useState([]);
  const handleOnChange = ({ file, fileList, event }) => {
    setDefaultFileList(fileList);
  };

  const uploadThumbnail = async (options) => {
    const { onSuccess, onError, file } = options;

    try {
      setThumbnailFile(file);
      onSuccess("Ok");
    } catch (err) {
      console.error("Error: ", err);
      const error = new Error("Some error");
      onError({ err });
    }
  };

  const uploadVideo = async (options) => {
    const { onSuccess, onError, file } = options;

    try {
      setVideoFile(file);
      onSuccess("Ok");
    } catch (err) {
      console.error("Error: ", err);
      const error = new Error("Some error");
      onError({ err });
    }
  };

  return (
    <div className="p-5">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-5 mx-auto w-2/3"
      >
        <h1 className="text-2xl font-bold mb-4">Add a video</h1>
        <label className="block">
          <p className="font-bold">Privacy</p>
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={() => handleStateChange("Public")}
              className={`border rounded-md py-2 px-4 ${
                state === "Public"
                  ? "bg-green-500 text-white"
                  : "bg-white text-green-500 border border-green-500"
              }`}
            >
              Public
            </button>
            <button
              type="button"
              onClick={() => handleStateChange("Unlisted")}
              className={`border rounded-md py-2 px-4 ${
                state === "Unlisted"
                  ? "bg-yellow-500 text-white"
                  : "bg-white text-yellow-500 border border-yellow-500"
              }`}
            >
              Unlisted
            </button>
            <button
              type="button"
              onClick={() => handleStateChange("Private")}
              className={`border rounded-md py-2 px-4 ${
                state === "Private"
                  ? "bg-red-500 text-white"
                  : "bg-white text-red-500 border border-red-500"
              }`}
            >
              Private
            </button>
          </div>
        </label>
        <label className="block">
          <p className="font-bold">Title</p>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="border border-gray-400 rounded-md w-full p-2 mt-1"
          />
        </label>
        <label className="block">
          <p className="font-bold">Description</p>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            className="border border-gray-400 rounded-md w-full p-2 mt-1"
          />
        </label>
        <label className="block">
          <p className="font-bold mb-2">Video file</p>
          <Upload
            listType="picture"
            accept="video/*"
            name="video"
            showUploadList={true}
            onPreview={handlePreview}
            onChange={handleOnChange}
            defaultFileList={defaultFileList}
            customRequest={uploadVideo}
            multiple={false}
            maxCount={1}
            //-------------------UPLOAD FILE
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </label>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={""}
          onCancel={handleCancel}
        >
          {contentType === "image" && (
            <img alt="example" style={{ width: "100%" }} src={preview} />
          )}
          {contentType === "video" && (
            <video controls style={{ width: "100%" }}>
              <source src={preview} type="video/mp4" />
            </video>
          )}
        </Modal>
        <label className="block">
          <p className="font-bold mb-2">Thumbnail</p>
          <ImgCrop rotationSlider aspect={16 / 9}>
            <Upload
              listType="picture"
              accept="image/png, image/jpeg, image/jpg"
              name="thumbnail"
              showUploadList={true}
              onPreview={handlePreview}
              onChange={handleOnChange}
              defaultFileList={defaultFileList}
              customRequest={uploadThumbnail}
              multiple={false}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </ImgCrop>
        </label>

        <button
          type="submit"
          className={`border border-black text-black rounded-md py-2 px-4 mt-3 hover:bg-gray-300 ${
            submitDisabled ? "bg-gray-300" : "bg-white "
          }`} // Add conditional class for button color"
          disabled={submitDisabled} // Disable the button based on the state
        >
          <p className="font-bold">Add my video</p>
        </button>
      </form>
      {showProgressBar && (
        <>
          <progress
            value={progress}
            max="100"
            className="w-2/3 mx-auto block"
          />
        </>
      )}
    </div>
  );
}

export default UploadVideoPage;
