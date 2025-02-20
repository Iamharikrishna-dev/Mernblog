import axios from 'axios';
import { useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'; // Import the styles
import './CreateBlog.css'; // Import the new CSS file

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.token) {
      alert('Please log in to create a blog');
      return;
    }

    try {
      setLoading(true);

      const contentState = editorState.getCurrentContent();
      const content = JSON.stringify(convertToRaw(contentState)); // Get raw content

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        'https://mernblog-six.vercel.app/api/blogs',
        { title, content },
        config
      );

      console.log('Blog created successfully:', data);
      window.location.href = '/';
    } catch (error) {
      console.error('Error creating blog:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submitHandler} className="create-blog-form">
<h2>Write a Blog</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <div className="editor-container">
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          placeholder="Content"
          toolbarClassName="toolbar-class"
          wrapperClassName="wrapper-class"
          editorClassName="editor-class"
        />
      </div>

      {/* Image upload is commented out as requested */}
      {/* <input type="file" accept="image/*" onChange={imageChangeHandler} />
      {imageUploading && <p>Uploading image...</p>} */}

      <button type="submit" disabled={loading}>
        {loading && <span className="spinner"></span>}
        Create Blog
      </button>
    </form>
  );
};

export default CreateBlog;
