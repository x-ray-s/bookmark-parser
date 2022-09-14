module.exports = {
    content: ['./src/**/*.{vue,js,ts}', './index.html'],
    plugins: [require('daisyui')],
    daisyui: {
        styled: true,
        themes: true,
        base: true,
        utils: true,
        logs: true,
        rtl: false,
        prefix: '',
        darkTheme: 'dark',
    },
}
