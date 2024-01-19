export const App = () => {
  return (
    <main>
      <div className="container">
        <div className="grid grid-cols-1">
          <div className="mt-5 text-2xl">Joan Cochachi</div>
          <ul>
            {[...new Array(20)].map((_, index) => (
              <li key={index}>{index + 1}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};
