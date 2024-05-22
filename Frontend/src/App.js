import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setFeedback(data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      name,
      email,
      text,
    };

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setName(''); // Clear form fields
        setEmail('');
        setText('');
        fetchFeedback(); // Fetch the updated feedback list
      } else {
        console.error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <center><h1 className='text-primary mb-5'><u>Feedback Form</u></h1></center>
      <div className="d-flex justify-content-center align-items-center">
        <div className='card p-4 shadow'>
          {isSubmitted ? (
            <div className='alert alert-success'>Your form is submitted successfully.</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nameInput" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control mb-3"
                  id="nameInput"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="emailInput" className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="emailInput"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-describedby="emailHelp"
                />
              </div>
              <div className="mb-3 row">
                <label htmlFor="textInput" className="col-form-label">Feedback</label>
                <div className="col-sm-15">
                  <textarea
                    className="form-control"
                    id="exampleTextarea"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{ height: '100px' }}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-success">Submit</button>
            </form>
          )}
        </div>
      </div>
      <div className="mt-4 d-flex justify-content-center">
        <div className="w-75">
          <h2 className="text-center">Feedback Received</h2>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {feedback.map((post) => (
                <tr key={post._id}>
                  <td>{post.name}</td>
                  <td>{post.email}</td>
                  <td>{post.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
