import { FC } from "react";
import { Link } from "react-router-dom";

const Home: FC = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="min-h-screen bg-gradient-to-r from-purple-600 to-blue-500 text-white flex items-center justify-center">
        <section className="text-center">
          <h1 className="text-6xl font-bold animate-typing overflow-hidden border-r-4 border-white whitespace-nowrap mb-4">
            Create & Join Exciting Raffles
          </h1>
          <p className="text-xl mb-8">
            Build your own raffles or participate in others to win amazing
            prizes!
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/auth"
              className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-full text-xl font-semibold shadow-lg hover:bg-yellow-400 transition-all duration-300"
            >
              Create a Raffle
            </Link>
            <button className="bg-green-500 text-white px-6 py-3 rounded-full text-xl font-semibold shadow-lg hover:bg-green-400 transition-all duration-300">
              Join a Raffle
            </button>
          </div>
        </section>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-gray-100 text-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Choose Our Platform?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4">Easy Raffle Creation</h3>
              <p className="text-gray-600">
                Quickly create raffles with customizable options to suit your
                needs.
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4">Join & Win</h3>
              <p className="text-gray-600">
                Browse and join raffles hosted by others for a chance to win
                fantastic prizes.
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4">Trusted & Secure</h3>
              <p className="text-gray-600">
                All transactions are secure, ensuring your privacy and safety
                during participation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white text-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-100 p-8 rounded-lg shadow-md">
              <p className="italic">
                "Creating a raffle was so simple, and I had tons of
                participants. Amazing experience!"
              </p>
              <p className="mt-4 font-bold">- Alex Brown</p>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg shadow-md">
              <p className="italic">
                "I joined a raffle and won a weekend getaway! This platform is
                awesome!"
              </p>
              <p className="mt-4 font-bold">- Emily Clark</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-blue-500 text-white text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-xl mb-8">
          Sign up now to create or join raffles and stand a chance to win big!
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-yellow-500 text-gray-900 px-8 py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-yellow-400 transition-all duration-300">
            Sign Up to Create
          </button>
          <button className="bg-green-500 text-white px-8 py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-green-400 transition-all duration-300">
            Sign Up to Join
          </button>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-8 bg-gray-900 text-white text-center">
        <p>&copy; 2024 Raffle App. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Home;
