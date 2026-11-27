/** Preserved portrait-orientation prompt from the original experience pages. */
export default function OrientationNotice({ cover }) {
  return (
    <div
      className="fixed inset-0 z-[999999999999] hidden bg-[length:100%_100%] bg-cover portrait:block"
      style={{ backgroundImage: `url('${cover}')` }}
      aria-hidden="true"
    >
      <div className="flex h-full w-full items-center justify-center bg-black/70">
        <div className="flex flex-col items-center px-6 text-center">
          <img className="w-[200px] max-w-full" src="/assets/icon-horizontal.png" alt="" />
          <h1 className="mt-6 text-[28px] text-white">Please rotate your device.</h1>
        </div>
      </div>
    </div>
  );
}
