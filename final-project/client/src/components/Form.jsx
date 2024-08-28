import React from "react";

export default function Form() {
  return (
    <div>
      <form className="max-w-md mx-auto">
        <div className="grid gap-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm mb-2 dark:text-white"
            >
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                className="py-3 px-4 block w-full bg-gray-100 border-gray-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
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
            <p className="hidden text-xs text-red-600 mt-2" id="email-error">
              Please include a valid email address so we can get back to you
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
