import React from 'react';
import titleImage from '~/assets/images/kz_creation.svg?url';
import backgroundImage from '../../assets/images/u3629887153_a_stylish_fantasy_world_at_midnight_geometric_abs_49e0ca04-3bd7-4372-a11f-d2bb178a87cb_0.png?url';

export default function IndexContent() {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden m-0 p-0">
      <img
        src={backgroundImage}
        alt="backgroundImage"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <img
          src={titleImage}
          alt="titleImage"
          className="w-1/2 h-auto max-w-4xl"
        />
      </div>
    </div>
  )
}
