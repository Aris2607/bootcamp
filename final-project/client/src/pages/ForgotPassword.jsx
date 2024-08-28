import React, { useState } from "react";
import { createData } from "../services/Api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createData("/reset", { email });
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-7 bg-white border max-w-md mx-auto border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
      <div className="p-4 sm:p-7">
        <div className="text-center">
          <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
            Reset Password
          </h1>
        </div>

        <div className="mt-5">
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="grid gap-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm mb-2 dark:text-white"
                >
                  Email:
                </label>
                <div className="relative mb-4">
                  <input
                    type="text"
                    id="email"
                    name="email"
                    className="py-3 px-4 block w-full bg-gray-100 border-gray-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-describedby="email-error"
                  />
                  <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                    <svg
                      className="size-5 text-red-500"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                    </svg>
                  </div>
                </div>
                <p
                  className="hidden text-xs text-red-600 mt-2"
                  id="email-error"
                >
                  Please include a valid email address so we can get back to you
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              Reset
            </button>
          </form>
          {/* <!-- End Form --> */}
        </div>
      </div>
    </div>
  );
}
