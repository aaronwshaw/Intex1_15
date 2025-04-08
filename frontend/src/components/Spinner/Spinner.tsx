import { JSX } from 'react';
import style from './Spinner.module.css';

export default function Spinner(): JSX.Element {
  return (
    <div className="flex justify-center items-center">
      <span className={style.loader}></span>
    </div>
  );
}

