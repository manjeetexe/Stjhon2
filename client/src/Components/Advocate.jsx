import React from 'react'

const Advocate = () => {
  return (
    <div className='w-70 border rounded-lg bg-black p-3 py-4 text-white '>
        <div className='flex gap-4  items-center'>
            <div className='size-10 bg-white rounded-full'></div>
            <h1>Manjeer Sharma</h1>
        </div>
        <div className='flex gap-14 pl-14 text-sm'>
            <h1>Age: 18</h1>
            <h1>Exp: 2 years</h1>
        </div>
        <div className='flex gap-8 pl-14 text-sm'>
            <h1>Cases: +78</h1>
            <h1>Loc: Boisar</h1>

        </div>
        <div className='flex gap-3 pl-14 mt-2'>
            <h1 className='px-3 bg-white rounded-[2px]  text-black'>Connect</h1>
            <h1 className='px-3 bg-white rounded-[2px] text-black'>Review</h1>
        </div>
    </div>
  )
}

export default Advocate