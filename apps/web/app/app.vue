<template>
  <main>
    <section class="hero">
      <NuxtRouteAnnouncer />
      <div class="hero-copy">
        <p class="eyebrow">project.askmewhy.cn</p>
        <h1>Ask Project</h1>
        <p class="lead">
          面向项目从 0 到 1 的思考工作台，把问题、方案、任务和结果沉淀成一条稳定的交付线。
        </p>
        <div class="actions">
          <a href="#contact">预约体验</a>
          <a href="#workflow">查看流程</a>
        </div>
      </div>
    </section>

    <section id="workflow" class="workflow" aria-label="Ask Project 工作流">
      <div>
        <p class="section-label">Workflow</p>
        <h2>从一句模糊想法，到可执行项目。</h2>
      </div>
      <div class="steps">
        <article>
          <span>01</span>
          <h3>整理问题</h3>
          <p>把零散输入收束成目标、边界和关键假设。</p>
        </article>
        <article>
          <span>02</span>
          <h3>形成方案</h3>
          <p>把讨论转换成结构化路径、风险判断和任务拆解。</p>
        </article>
        <article>
          <span>03</span>
          <h3>持续交付</h3>
          <p>跟踪每次推进，保留上下文，让项目自然向前。</p>
        </article>
      </div>
    </section>

    <section id="contact" class="contact">
      <p>Ask Project 桌面端与 Web 官网已进入初始搭建阶段。</p>
      <a href="mailto:hello@askmewhy.cn">hello@askmewhy.cn</a>
    </section>
  </main>
</template>

<style>
:root {
  color: #17211e;
  background: #f4f0e4;
  font-family: "Avenir Next", Avenir, "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

.hero {
  min-height: 82vh;
  display: grid;
  align-items: center;
  padding: clamp(28px, 6vw, 76px);
  color: #fff8e7;
  background:
    linear-gradient(90deg, rgba(12, 25, 22, 0.88), rgba(12, 25, 22, 0.5) 48%, rgba(12, 25, 22, 0.08)),
    url("/project-console.png") center / cover no-repeat;
}

.hero-copy {
  max-width: 760px;
}

.eyebrow,
.section-label {
  margin: 0 0 18px;
  color: #f7cf6a;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 20px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(64px, 12vw, 152px);
  line-height: 0.86;
}

.lead {
  max-width: 620px;
  margin-bottom: 34px;
  color: rgba(255, 248, 231, 0.86);
  font-size: clamp(18px, 2.2vw, 25px);
  line-height: 1.6;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.actions a,
.contact a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
  border-radius: 8px;
  font-weight: 900;
}

.actions a:first-child,
.contact a {
  color: #15231f;
  background: #f7cf6a;
}

.actions a:last-child {
  border: 1px solid rgba(255, 248, 231, 0.48);
}

.workflow {
  display: grid;
  grid-template-columns: minmax(260px, 0.75fr) minmax(320px, 1.25fr);
  gap: clamp(28px, 6vw, 80px);
  padding: clamp(46px, 8vw, 92px) clamp(24px, 6vw, 76px);
  background: #f4f0e4;
}

.workflow h2 {
  max-width: 520px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(36px, 5vw, 72px);
  line-height: 0.98;
}

.steps {
  display: grid;
  gap: 12px;
}

.steps article {
  padding: 22px;
  border: 1px solid rgba(23, 33, 30, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.5);
}

.steps span {
  color: #c8452d;
  font-weight: 900;
}

.steps h3 {
  margin: 14px 0 8px;
  font-size: 22px;
}

.steps p {
  margin-bottom: 0;
  color: rgba(23, 33, 30, 0.66);
  line-height: 1.7;
}

.contact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 26px clamp(24px, 6vw, 76px);
  color: #fff8e7;
  background: #17211e;
}

.contact p {
  margin-bottom: 0;
}

@media (max-width: 760px) {
  .hero {
    min-height: 78vh;
    align-items: end;
  }

  .workflow {
    grid-template-columns: 1fr;
  }

  .contact {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
