/** @type {import('tailwindcss').Config} */
module.exports = {
  // Every file that can contain class names. Tailwind scans these as plain text, so
  // classes written inside <script> blocks and template literals are picked up too.
  content: ['./*.html', './js/**/*.js', './translations.js'],
  theme: {
    extend: {},
  },
  plugins: [],
}
