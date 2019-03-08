const Koa = require('koa')
const Router = require('koa-router')
const next = require('next')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = new Koa()
    const router = new Router();

    router.get(['/', '/index'], async (ctx, next) => {
        let indexPath = "/index";

        ctx.req.note = "Hello world";
        await app.render(ctx.req, ctx.res, indexPath, ctx.query);
    })


    router.get('*', async (ctx, next) => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false
    });

    server.use(async (ctx, next) => {
        ctx.res.statusCode = 200;
        await next()
    });

    server.use(router.routes());

    server.listen(3000, (err) => {
        if (err) throw err
        console.log('> Ready on http://localhost:3000')
    })
})