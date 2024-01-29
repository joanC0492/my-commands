export const App = () => {
  return (
    <main className="min-h-screen bg-jc-primary text-white">
      <div className="container">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <p className="mt-5 text-2xl">Joan Cochachi</p>
          </div>
          <div className="col-span-6">
            <ul>
              {[...new Array(20)].map((_, index) => (
                <li key={index}>{index + 1}</li>
              ))}
            </ul>
          </div>
          <div className="col-span-6">
            <form>
              <p className="text-xl">Formulario</p>
              <input className="" type="text" placeholder="" />
              <button className="" type="submit">
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};
