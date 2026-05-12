import React, { useState } from "react";

function Reg() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [form, setForm] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setForm({ firstname, lastname, email, phonenumber, username, password });
    console.log("particulars:", {
      firstname,
      lastname,
      email,
      phonenumber,
      username,
      password,
    });
  };

  return (
    <>
      <div>
        <p>REgister</p>
        <div className=" w-[40%] mx-auto justify-center items-center p-20">
          <form
            className="grid grid-rows-7 text-xl gap-4"
            action=""
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <input
              type="text"
              placeholder="Lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="tel"
              placeholder="phonenumber"
              value={phonenumber}
              onChange={(e) => setPhonenumber(e.target.value)}
            />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="border-2 rounded-lg border-blue-700 bg-blue-400 text-black/80 px-3 py-2 text-xl font-bold">
              Submit
            </button>
          </form>

          {form && (
            <div>
              <p>Firstname: {form.firstname}</p>
              <p>Lastname: {form.lastname}</p>
              <p>Email: {form.email}</p>
              <p>Phonenumber: {form.phonenumber}</p>
              <p>Username: {form.username}</p>
              <p>Password: {form.password}</p>
            </div>
          )}
        </div>
      </div>
      ;
    </>
  );
}

export default Reg;
