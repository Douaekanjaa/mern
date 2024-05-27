import React from "react";
import { Link } from "react-router-dom";

export default function CategoryCard({ category }) {
  return (
    <Link to={`/category/${category._id}`} className="block">
      <div className="relative bg-white shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-2">
        <img
          className="w-full h-36 object-cover"
          loading="lazy"
          src={category.picture}
          alt={category.name}
        />
        <div className="p-3">
          <h2 className="text-lg font-bold text-gray-800">{category.name}</h2>
        </div>
      </div>
    </Link>
  );
}
