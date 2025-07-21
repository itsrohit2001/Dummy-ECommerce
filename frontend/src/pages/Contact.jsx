import { useActionState, useEffect } from "react";

const Contact = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  function handleContactAction(formData) {
    const enteredName = formData.name;
    const enteredEmail = formData.email;
    const enteredMessage = formData.message;

    let errors = [];
    if (!enteredName) {
      errors.push("Name is required");
    }
    if (!enteredEmail) {
      errors.push("Email is required");
    }
    if (!enteredMessage) {
      errors.push("Message is required");
    }

    if (errors.length > 0) {
      return { errors, message: errors.join(", ") };
    }

    return {errors: null};
  
    // You can now use these variables to send the data to your backend
    // console.log("Name:", enteredName);
    // console.log("Email:", enteredEmail);
    // console.log("Message:", enteredMessage);
  }

  const [formState, contactAction] = useActionState(handleContactAction, {errors: null});

  return (
    <div className="flex items-center justify-center p-4 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="flex flex-col items-center w-full max-w-lg px-8 py-10 bg-white shadow-2xl rounded-2xl md:px-12 md:py-12">
        <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-center text-blue-700">
          Contact <span className="text-purple-500">Us</span>
        </h1>
        <div className="w-16 h-1 mb-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
        <p className="mb-6 text-lg text-center text-gray-600">
          Have questions or need help? Reach out to our support team!
        </p>
        {/* action={} */}
        <form action={contactAction} className="flex flex-col w-full space-y-4">
          <input
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Your Name"
            required
            name="name"
            defaultValue={formState?.name || ""}
          />
          <input
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="email"
            placeholder="Your Email"
            required
            name="email"
            defaultValue={formState?.email || ""}
          />
          <textarea
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400  min-h-[100px] resize-none"
            placeholder="Your Message"
            required
            name="message"
            defaultValue={formState?.message || ""}
          ></textarea>
          <button
            className="w-full py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600"
            type="submit"
            // onClick={() => alert("Message sent!")}
          >
            Send Message
          </button>
        </form>
        <div className="mt-8 text-sm text-center text-gray-400">
          We usually respond within 24 hours.
        </div>
      </div>
    </div>
  );
};

export default Contact;