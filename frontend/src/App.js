import { useState } from "react";
import "./SpeakingEvaluation.css";

export default function SpeakingEvaluation() {
  const [audioFile, setAudioFile] = useState(null);
  const [textInput, setTextInput] = useState(""); // State cho bài viết
  const [result, setResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false); // State gửi bài viết

  // Xử lý chọn file
  const handleFileChange = (event) => {
    setAudioFile(event.target.files[0]);
  };

  // Gửi file ghi âm
  const handleUpload = async () => {
    if (!audioFile) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("audio", audioFile);

    try {
      const response = await fetch("http://localhost:5000/evaluate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  // Gửi bài viết
  const handleSubmitText = async () => {
    if (!textInput.trim()) return;
    setSubmitting(true);
    console.log(textInput)
    try {
      const response = await fetch("http://localhost:5000/evaluate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textInput }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="content">
        {/* Cột bên trái - Tải file + Nộp bài viết */}
        <div className="left-column">
          {/* Phần tải file */}
          <div className="card upload-card">
            <div className="card-content">
              <label className="upload-box">
                <span className="upload-text">Chọn file ghi âm</span>
                <input type="file" accept="audio/*" className="hidden" onChange={handleFileChange} />
              </label>
              {audioFile && <p className="file-name">{audioFile.name}</p>}
              <button onClick={handleUpload} disabled={!audioFile || uploading} className="btn">
                {uploading ? "Đang tải lên..." : "Gửi file"}
              </button>
            </div>
          </div>

          {/* Phần nộp bài viết */}
          <div className="card text-card">
            <div className="card-content">
              {/* <h2>Nộp bài viết</h2> */}
              <textarea
                className="text-input"
                rows="5"
                placeholder="Nhập bài viết của bạn..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              ></textarea>
              <button onClick={handleSubmitText} disabled={submitting || !textInput.trim()} className="btn">
                {submitting ? "Đang gửi..." : "Gửi bài viết"}
              </button>
            </div>
          </div>
        </div>

        {/* Cột bên phải - Hiển thị kết quả */}
        {result && (
          <div className="card result-card">
            <div className="card-content">
              <h2>Kết quả</h2>
              <p><strong>Điểm:</strong> <span className="score">{result.score}</span></p>
              <p><strong>Nhận xét:</strong> {result.comment}</p>
              <p><strong>Gợi ý cải thiện:</strong> {result.suggest}</p>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${result.score * 10}%` }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
