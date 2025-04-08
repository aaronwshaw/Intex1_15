
function LandingPage() {
  console.log('Rendering CategorySlider');

  return (
    <div className="overflow-x-hidden" style={{ paddingTop: '5rem' }}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="text-center text-4xl font-bold mb-4">Welcome to MovieHub</h1>
            <p className="text-center text-lg mb-8">
              Your one-stop destination for all things movies!
            </p>
          </div>
        </div>
      </div>

      {/* Add your category slider or any other components here */}
    </div>
  
  );
}

export default LandingPage;
