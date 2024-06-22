import Image from "next/image";
import Link from "next/link";
import PredictionForm from '@/app/components/PredictionForm';
import ClassificationForm from '@/app/components/ClassificationForm';


export default function Home() {
  return (
    <div className="container mx-auto px-20">
      <h1 className="text-3xl font-bold text-center mt-8">Stock Market Analysis</h1>
      <div className="flex justify-center mt-8">
        <div className="w-1/2">
          <PredictionForm />
        </div>
        <div className="border-l-2 border-gray-300 mx-8"></div>
        <div className="w-1/2">
          <ClassificationForm />
        </div>
      </div>
    </div>
  );
}
