import React from 'react';

export default function Categories() {
  return (
    <div>
      <div className="block rounded-lg bg-white shadow-secondary-1 dark:bg-surface-dark">
        <a href="#!">
          <img
            className="rounded-t-lg"
            src="https://tecdn.b-cdn.net/img/new/standard/nature/184.jpg"
            alt=""
          />
        </a>
        <div className="p-4 text-sm text-surface dark:text-white">
          <h5 className="mb-1 text-lg font-medium leading-tight">Card title</h5>
          <p className="mb-2 text-base">
            tttt
          </p>
          <button
            type="button"
            className="inline-block rounded bg-primary px-4 pb-1.5 pt-1.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
            data-twe-ripple-init
            data-twe-ripple-color="light"
          >
            Button
          </button>
        </div>
      </div>
      <div className="block rounded-lg bg-white shadow-secondary-1 dark:bg-surface-dark">
        <a href="#!">
          <img
            className="rounded-t-lg"
            src="https://tecdn.b-cdn.net/img/new/standard/nature/184.jpg"
            alt=""
          />
        </a>
        <div className="p-4 text-sm text-surface dark:text-white">
          <h5 className="mb-1 text-lg font-medium leading-tight">Card title</h5>
          <p className="mb-2 text-base">
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </p>
          <button
            type="button"
            className="inline-block rounded bg-primary px-4 pb-1.5 pt-1.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
            data-twe-ripple-init
            data-twe-ripple-color="light"
          >
            Button
          </button>
        </div>
      </div>

    </div>
  );
}
