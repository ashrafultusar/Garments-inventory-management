"use client";

import React, { useState } from "react";

const page = () => {
  const [formData, setFormData] = useState({
    username: "",
    emailAddress: "",
    password: "",
    passwordConfirmation: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Submitted:", formData);
  };

  return (
    <section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800">
      <h2 className="text-lg font-semibold text-gray-700 capitalize dark:text-white">
        Account settings
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="username"
              className="text-gray-700 dark:text-gray-200"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md 
                dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 
                focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 
                dark:focus:border-blue-300 focus:outline-none focus:ring"
            />
          </div>

          <div>
            <label
              htmlFor="emailAddress"
              className="text-gray-700 dark:text-gray-200"
            >
              Email Address
            </label>
            <input
              id="emailAddress"
              type="email"
              value={formData.emailAddress}
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md 
                dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 
                focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 
                dark:focus:border-blue-300 focus:outline-none focus:ring"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-gray-700 dark:text-gray-200"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md 
                dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 
                focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 
                dark:focus:border-blue-300 focus:outline-none focus:ring"
            />
          </div>

          <div>
            <label
              htmlFor="passwordConfirmation"
              className="text-gray-700 dark:text-gray-200"
            >
              Password Confirmation
            </label>
            <input
              id="passwordConfirmation"
              type="password"
              value={formData.passwordConfirmation}
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md 
                dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 
                focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 
                dark:focus:border-blue-300 focus:outline-none focus:ring"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform 
              bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600 cursor-pointer"
          >
            Save
          </button>
        </div>
      </form>
    </section>
  );
};

export default page;
