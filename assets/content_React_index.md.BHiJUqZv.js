import{_ as s,c as i,o as a,a2 as n}from"./chunks/framework.DwDoyBw8.js";const g=JSON.parse('{"title":"React","description":"","frontmatter":{},"headers":[],"relativePath":"content/React/index.md","filePath":"content/React/index.md"}'),e={name:"content/React/index.md"},t=n(`<h1 id="react" tabindex="-1">React <a class="header-anchor" href="#react" aria-label="Permalink to &quot;React&quot;">​</a></h1><h2 id="_1-redux-中-reducer-不能做异步操作的原因" tabindex="-1">1 Redux 中 reducer 不能做异步操作的原因 <a class="header-anchor" href="#_1-redux-中-reducer-不能做异步操作的原因" aria-label="Permalink to &quot;1 Redux 中 reducer 不能做异步操作的原因&quot;">​</a></h2><ol><li>先从 Redux 的设计层面来解释为什么 Reducer 必须是纯函数</li></ol><p>如果你经常用 <code>React + Redux</code> 开发，那么就应该了解 <code>Redux</code> 的设计初衷。 <code>Redux</code> 的设计参考了 <code>Flux</code> 的模式，作者希望以此来实现时间旅行，保存应用的历史状态，实现应用状态的可预测。所以整个 <code>Redux</code> 都是函数式编程的范式，要求 <code>reducer</code> 是纯函数也是自然而然的事情，使用纯函数才能保证相同的输入得到相同的输出，保证状态的可预测。所以 <code>Redux</code> 有三大原则：</p><ul><li>单一数据源，也就是 <code>state</code></li><li><code>state</code> 是只读， <code>Redux</code> 并没有暴露出直接修改 <code>state</code> 的接口，必须通过 <code>action</code> 来触发修改</li><li>使用纯函数来修改 <code>state</code>，<code>reducer</code> 必须是纯函数</li></ul><ol start="2"><li>下面 再从代码层面来解释为什么 reducer 必须是纯函数</li></ol><p>那么 reducer 到底干了件什么事， 在 Redux 的源码中只用了一行来表示：</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  currentState </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> currentReducer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(currentState, action)</span></span></code></pre></div><p>这一行简单粗暴的在代码层面解释了为什么 <code>currentReducer</code> 必须是纯函数。 <code>currentReducer</code> 就是我们在 <code>createStore</code> 中传入的 <code>reducer</code> （至于为什么会加个 <code>current</code> 有兴趣的可以自己去看源码 ），<code>reducer</code> 是用来计算 <code>state</code> 的，所以它的返回值必须是 <code>state</code>, 也就是我们整个应用的状态，而不是 <code>promise</code> 之类的。</p><p>要在 <code>reducer</code> 中加入异步的操作，如果你只是单纯想执行异步操作，不会等待异步的返回，那么在 <code>reducer</code> 中执行的意义是什么。如果想把异步操作的结果反映在 <code>state</code> 中，首先整个应用的状态将变的不可预测， 违背 <code>Redux</code> 的设计原则，其次，此时的 <code>currentState</code> 将会是 <code>promise</code> 之类而不是我们想要的应用状态，根本是行不通的。</p><h2 id="_2-react-中-fiber-是用来做什么的" tabindex="-1">2 React 中 fiber 是用来做什么的 <a class="header-anchor" href="#_2-react-中-fiber-是用来做什么的" aria-label="Permalink to &quot;2 React 中 fiber 是用来做什么的&quot;">​</a></h2><p>因为 Javascript 单线程的特点，每个同步任务不能耗时太长，不然就会让程序不会对其他输入做出相应操作，React 的更新过程就是犯了这个禁忌，而 React Fiber 就是要改变现状。而可以通过分片来破解 Javascript 中同步操作时间过长的问题。</p><p>把一个耗时长的任务分成很多小片，每一个小片的运行时间很短，虽然总时间依然很长，但是在每个小片执行完之后，都给其他任务一个执行的机会，这样唯一的线程就不会被独占，其他任务易燃有运行的机会。</p><p>React Fiber 把更新过程碎片化，每执行完一段更新过程，就把控制权交还给 React 负责任务协调的模块，看看有没有其他紧急任务要做，如果没有就继续去更新，如果有紧急任务，那就去做紧急任务。</p><p>维护每一个分片的数据结构，就是 Fiber。</p><h2 id="_3-react-生命周期" tabindex="-1">3 React 生命周期 <a class="header-anchor" href="#_3-react-生命周期" aria-label="Permalink to &quot;3 React 生命周期&quot;">​</a></h2><p><strong>初始化阶段：</strong></p><ul><li><code>getInitialState</code> 获取每个实例的初始化状态</li><li><code>getDefaultProps</code> 获取实例的默认属性</li><li><code>componentWillMount</code> 组件即将被装载、渲染到页面上</li><li><code>render</code> 组件在这里生成虚拟的DOM节点</li></ul><p><strong>运行中状态：</strong></p><ul><li><code>componentWillReceiveProps</code> 组件将要接收到属性的时候调用</li><li><code>shouldComponentUpdate</code> 组件接收到新属性或者新状态的时候（可以返回 false，接收数据后不更新，阻止 render 调用， 后面的函数不会被继续执行了）</li><li><code>componentWillUpdate</code> 组件即将更新不能修改属性和状态</li><li><code>render</code> 组件重新描绘</li><li><code>componentDidUpdate</code> 组件已经更新完成</li></ul><p><strong>卸载过程：</strong></p><ul><li><code>componentWillUnmount</code> 组件即将销毁</li></ul><h2 id="_4-shouldcomponentupdate-函数有什么作用" tabindex="-1">4 shouldComponentUpdate 函数有什么作用 <a class="header-anchor" href="#_4-shouldcomponentupdate-函数有什么作用" aria-label="Permalink to &quot;4 shouldComponentUpdate 函数有什么作用&quot;">​</a></h2><p><code>shouldComponentUpdate</code> 是一个允许我们自行决定某些组件（以及他们的子组件）是否进行更新的生命周期函数，<code>Reconciliation</code> 的最终目的是尽可能以最有效的方式去根据新的 <code>state</code> 更新UI，如果你已经知道 UI 的哪些状态无需进行改变，就没必要去让 <code>React</code> 去判断它是否该改变。让 <code>shouldComponentUpdate</code> 返回 <code>false</code>， <code>React</code> 就会让当前的组件和其子组件保持不变。</p><h2 id="_5-当组件的setstate函数被调用之后-发生了什么" tabindex="-1">5 当组件的setState函数被调用之后，发生了什么 <a class="header-anchor" href="#_5-当组件的setstate函数被调用之后-发生了什么" aria-label="Permalink to &quot;5 当组件的setState函数被调用之后，发生了什么&quot;">​</a></h2><p>在代码中调用 <code>setState</code> 函数之后， <code>React</code> 会将传入的参数对象与组件当前的状态合并，然后触发所谓的调和过程（Reconciliation）。</p><p>经过调和过程， <code>React</code> 会以相对高效的方式根据新的状态构建 <code>React</code> 元素数并且着手重新渲染整个UI界面。在 <code>React</code> 得到元素树之后， <code>React</code> 会自动计算出新的树和老树的节点差异，然后根据差异对界面进行最小化重渲染。在差异计算算法中， <code>React</code> 能够相对精确地知道哪些位置发生了改变以及应该如何改变，这就保证了按需更新，而不是全部重新渲染。</p><h2 id="_6-在生命周期中的哪一步你应该发起-ajax-请求" tabindex="-1">6 在生命周期中的哪一步你应该发起 AJAX 请求 <a class="header-anchor" href="#_6-在生命周期中的哪一步你应该发起-ajax-请求" aria-label="Permalink to &quot;6 在生命周期中的哪一步你应该发起 AJAX 请求&quot;">​</a></h2><p><code>React</code> 下一代调和算法 <code>Fiber</code> 会通过开始或停止渲染的方式优化应用性能，其会影响到 <code>componentWillMount</code> 的触发次数。对于 <code>componentWillMount</code> 这个生命周期的调用次数会变得不确定，<code>React</code> 可能会多次频繁调用 <code>componentWillMount</code>。 如果我们将 <code>AJAX</code> 请求放到 <code>componentWillMount</code> 函数中， 那么显而易见其会被触发多次，自然也就不是好的选择。</p><p>如果我们将 <code>AJAX</code> 请求放置到生命周期的其他函数中， 我们并不能保证请求仅在组件挂载完毕后才会要求响应。如果我们的数据请求在组件挂载之前就完成，并且调用了 <code>setState</code> 函数将数据添加到组件状态中，对于未挂载的组件则会报错。而在 <code>componentDidMount</code> 函数中进行 <code>AJAX</code> 请求则能有效避免这个问题。</p><h2 id="_7-createelement-与-cloneelement-的区别是什么" tabindex="-1">7 createElement 与 cloneElement 的区别是什么 <a class="header-anchor" href="#_7-createelement-与-cloneelement-的区别是什么" aria-label="Permalink to &quot;7 createElement 与 cloneElement 的区别是什么&quot;">​</a></h2><p>createElement 函数是 JSX 编译之后使用的创建 React Element 的 <code>函数</code>， 而 cloneElement 则是用于复制某个 <code>元素</code> 并传入新的 Props。</p><h2 id="_8-传入-setstate-函数的第二个参数的作用是什么" tabindex="-1">8 传入 setState 函数的第二个参数的作用是什么 <a class="header-anchor" href="#_8-传入-setstate-函数的第二个参数的作用是什么" aria-label="Permalink to &quot;8 传入 setState 函数的第二个参数的作用是什么&quot;">​</a></h2><p>该函数会在 <code>setState</code> 函数调用完成并且组件开始重渲染的时候被调用，我们可以用来该函数来监听渲染是否完成：</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setState</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      username: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;fangyuan&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;setState has finished and the component has re-rendered.&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  )</span></span></code></pre></div><h2 id="_9-浅谈-useeffect" tabindex="-1">9 浅谈 useEffect <a class="header-anchor" href="#_9-浅谈-useeffect" aria-label="Permalink to &quot;9 浅谈 useEffect&quot;">​</a></h2><p><strong>一、说说 useEffect， 什么是副作用? 第二个参数为 【】 是什么意思?</strong></p><p><strong>1.什么是 useEffect</strong></p><p>React 官方文档解释：Effect Hook 可以让你在函数组件中执行 <strong>副作用</strong> 操作</p><p><strong>2.什么是副作用</strong></p><p>副作用（side effect）: 数据获取，数据订阅，以及手动更改 React 组件中的 DOM 都属于副作用。</p><p>因为我们渲染出的页面都是静态的，任何在其之后的操作都会对它产生影响，所以称之为副作用。</p><p>副作用又分为两种：（1）无需清楚的副作用 （2）需要清楚的副作用</p><p><strong>（1）无需清楚的副作用：</strong></p><p>有时候，我们只想在 React 更新 DOM 之后运行一些额外的代码。比如发送网络请求，手动变更DOM，记录日志，这些都是常见的无需清楚的操作。因为我没在执行完这些操作之后，就可以忽略他们了。</p><p><strong>（2）需要清除的副作用：</strong> 之前，我们研究了如何使用不需要清除的副作用，还有一些副作用的需要清除的。例如外部数据源，添加DOM事件。这种情况下，清除工作是非常重要的，可以防止引起内存泄露</p><p>在这个例子中，给鼠标的click事件添加了一个监听器，</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> React, { useState, useEffect } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;react&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> MouseTracker</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> React</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">FC</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [ </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">positions</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">setPositions</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> useState</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({ x: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, y: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> })</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    useEffect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      const</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> updateMouse</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">e</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> mouseEvent</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;inner&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        setPositions</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({ x: e.clientX, y: e.clientY })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      document.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addEventListener</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;click&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, updateMouse)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    })</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;X: {positions.x}, Y: {positions.y}&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    )</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> default</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> MouseTracker</span></span></code></pre></div><p>点击鼠标，会在屏幕打印出鼠标当前的位置，并在控制台打印出inner。但是这里存在一个问题，打印inner的次数并不是线性增加（点一次增加一次），而是点一次，inner被打印了多次。这是因为我们在每次更新渲染页面的时候都会调用 useEffect 的回调函数，这样就会添加越来越多的 click 时间，而没有清楚。</p><p><strong>如何清除?</strong></p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> React, { useState, useEffect } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;react&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> MouseTracker</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> React</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">FC</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [ </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">positions</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">setPositions</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> useState</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({ x: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, y: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    useEffect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      const</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> updateMouse</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">e</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> MouseEvent</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;inner&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        setPositions</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({ x: e.clientX, y: e.clientY })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      document.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addEventListener</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;click&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, updateMouse)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        document.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">removeEventListener</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;click&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, updateMouse)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    })</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;X: {positions.x}, Y: {positions.y}&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    )</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> default</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> MouseTracker</span></span></code></pre></div><p>可以发现，对比之前的代码，这里多 return 一个函数， 可以在这个函数中做清除操作， 现在点鼠标之后，inner被打印的次数就是线性增加，点一次，inner被打印一次，而不是被打印多次。</p><p><strong>3. useEffect的第二个参数? (控制 useEffect 的执行)</strong></p><ul><li><p>第一个参数为一个函数： 这个函数的目的就是为了告诉 React 组件需要在渲染后执行哪些操作，这个函数会在DOM更新之后被调用，use Effect 默认在每次渲染之后都会执行，但是也可以手动控制它的执行。</p></li><li><p>第二个参数（一个数组）： 当数组中的任意一项变化的时候，useEffect会被重新执行。 如果传递一个空数组 []，告诉 useEffect 不依赖于 state、props中任意值，useEffect就只会运行一次。</p><p><strong>如果数组中有值</strong></p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> React, { useState, useEffect } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;react&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> LikeButton</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> React</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">FC</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [ </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">like</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">setLike</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> useState</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">on</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">setOn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> useState</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    useEffect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;document title effect is running&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      document.title </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> \`点击了\${</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">like</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}次\`</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }, [like])</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      &lt;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">button</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> onClick</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{()</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setLike</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(like </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)}}&gt;{like}&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">button</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;.</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">button</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> onClick</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{()</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setOn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">on)}}&gt;{on </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;ON&#39;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> :</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;OFF&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">button</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      &lt;/&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    )</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span></code></pre></div><p>这里的依赖为 like， 只有当 like 变化时， useEffect 才会执行， 而当 on 变化时， useEffect 不会执行.</p><p><img src="https://cdn.jsdelivr.net/gh/fqcto/images/blogs/picture/20211119154806.png" alt="running图"></p></li></ul>`,54),h=[t];function l(p,k,d,E,r,c){return a(),i("div",null,h)}const y=s(e,[["render",l]]);export{g as __pageData,y as default};
