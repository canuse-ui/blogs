import{_ as s,c as a,o as n,a2 as p}from"./chunks/framework.DwDoyBw8.js";const b=JSON.parse('{"title":"GitLab + Docker 快速搭建 CI/CD 自动化部署","description":"","frontmatter":{},"headers":[],"relativePath":"content/Tools/CICD/index.md","filePath":"content/Tools/CICD/index.md"}'),e={name:"content/Tools/CICD/index.md"},l=p(`<h1 id="gitlab-docker-快速搭建-ci-cd-自动化部署" tabindex="-1">GitLab + Docker 快速搭建 CI/CD 自动化部署 <a class="header-anchor" href="#gitlab-docker-快速搭建-ci-cd-自动化部署" aria-label="Permalink to &quot;GitLab + Docker 快速搭建 CI/CD 自动化部署&quot;">​</a></h1><h2 id="什么是持续化集成" tabindex="-1">什么是持续化集成? <a class="header-anchor" href="#什么是持续化集成" aria-label="Permalink to &quot;什么是持续化集成?&quot;">​</a></h2><h3 id="ci" tabindex="-1">CI <a class="header-anchor" href="#ci" aria-label="Permalink to &quot;CI&quot;">​</a></h3><p>在持续集成环境中，开发人员将会频繁的提交代码到主干。这些新提交在最终合并到主线之前，都需要通过编译和自动化测试进行验证。这样做是基于之前持续集成过程中很重视自动化测试验证结果，以保障所有的提交在合并主干之后的质量问题，对可能出现的一些问题进行预计。</p><h3 id="持续交付" tabindex="-1">持续交付 <a class="header-anchor" href="#持续交付" aria-label="Permalink to &quot;持续交付&quot;">​</a></h3><p>持续交付就是讲我们的应用发布出去的过程。这个过程可以确保我们尽量可能快的实现交付。这就意味着除了自动化测试，我们还需要有自动化的发布流，以及通过一个按键就可以随时随地地实现应用的部署上线</p><p>通过持续交付，可以决定每天，每周，每两周发布一次，这完全可以根据自己的业务进行设置</p><p>但是，如果你真的希望体验持续交付的优势，就需要先进行小批量发布，尽快部署到生产线，以便在出现问题时方便进行故障排除</p><h3 id="持续部署" tabindex="-1">持续部署 <a class="header-anchor" href="#持续部署" aria-label="Permalink to &quot;持续部署&quot;">​</a></h3><p>如果我们想更加深入一步的话，就是持续部署了。通过这个方式，任何修改通过了所有已有的工作流就会直接和客户见面。没有人为干预（没有一键部署按钮），只有当一个修改在工作流中构建失败才能阻止它部署到产品线</p><p>持续部署是一个很优秀的方式，可以加速与客户的反馈循环，但是会给团队带来压力，因为不再有“发布日”了。开发人员可以专注于构建软件，他们看到他们修改在完成工作后几分钟就上线了。基本上，当开发人员在主分支合并一个提交时，这个分支将被构建，测试，如果一切顺利，则会部署到生产环境中。</p><h3 id="持续集成需求的必要性" tabindex="-1">持续集成需求的必要性 <a class="header-anchor" href="#持续集成需求的必要性" aria-label="Permalink to &quot;持续集成需求的必要性&quot;">​</a></h3><ul><li>持续集成是通过平台串联各个开发环节，实现和沉淀工作自动化的方法</li><li>线上代码和代码仓库不同步，影响迭代和团队协作</li><li>静态资源发布依赖人工，浪费开发人力</li><li>缺少自动化测试，产品质量得不到保障</li><li>文案简单修改上线，需要技术介入</li></ul><p><img src="https://cdn.jsdelivr.net/gh/fqcto/images/blogs/picture/20211129154803.png" alt="持续集成需求"></p><h2 id="gitlab" tabindex="-1">Gitlab <a class="header-anchor" href="#gitlab" aria-label="Permalink to &quot;Gitlab&quot;">​</a></h2><p>Gitlab是一个开源的版本管理系统，实现一个自托管的Git项目仓库，可通过 WEB 界面进行访问公开的或者私人项目。它拥有与Github类似的功能，能够浏览源码，管理缺陷和注释，可以管理团队对仓库的访问，它非常易于浏览提交的版本并提供一个文件历史库。团队成员可以利用内置的简单的聊天程序进行交流。它还提供一个代码片段收集功能可以实现代码复用。</p><p>GitLab对于系统性能有要求，所以我们需要将克隆出来的虚拟机的内存提高到至少2G以上。</p><h3 id="gitlab-安装" tabindex="-1">Gitlab 安装 <a class="header-anchor" href="#gitlab-安装" aria-label="Permalink to &quot;Gitlab 安装&quot;">​</a></h3><p><strong>方法一：</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>sudo docker run --detach \\</span></span>
<span class="line"><span>--hostname localhost \\</span></span>
<span class="line"><span>--publish 443:443 --publish 8084:8084 --publish 222:22 \\</span></span>
<span class="line"><span>--name gitlab \\</span></span>
<span class="line"><span>--restart always \\</span></span>
<span class="line"><span>--volume /home/docker/gitlab/config:/etc/gitlab \\</span></span>
<span class="line"><span>--volume /home/docker/gitlab/logs:/var/log/gitlab \\</span></span>
<span class="line"><span>--volume /home/docker/gitlab/data:/var/opt/gitlab \\</span></span>
<span class="line"><span>gitlab/gitlab-ce:latest</span></span></code></pre></div><p>localhost:主机名，即虚拟机的ip，8084可以自己定义端口号，restart重启方式，volume目录挂载，gitlab/gitlab-ce:latest镜像名</p><p><strong>方法二：</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>  docker pull twang2218/gitlab-ce-zh</span></span></code></pre></div><p>等待其拉取，然后在 /home 下新建docker 目录，再在其下新建 gitlab 目录，进入 gitlab 目录，在当前目录下新建 docker-compose.yml配置文件，编写内容如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>version: &#39;3&#39;</span></span>
<span class="line"><span>services:</span></span>
<span class="line"><span>  web:</span></span>
<span class="line"><span>    image:  &#39;twang2218/gitlab-ce-zh&#39;  #gitlab镜像</span></span>
<span class="line"><span>    restart:  always</span></span>
<span class="line"><span>    privileged: true  #权限</span></span>
<span class="line"><span>    hostname: &#39;&#39;  #主机名，即虚拟机的ip</span></span>
<span class="line"><span>    environment:</span></span>
<span class="line"><span>      TZ: &#39;Asia/Shanghai&#39;,</span></span>
<span class="line"><span>      GITLAB_OMNIBUS_CONFIG: |</span></span>
<span class="line"><span>        external_url  &#39;&#39;  #主机名，即虚拟机的ip</span></span>
<span class="line"><span>        gitlab_rails[&#39;gitlab_shell_ssh_port&#39;] = 2222</span></span>
<span class="line"><span>        unicorn[&#39;port&#39;] = 8888</span></span>
<span class="line"><span>        nginx[&#39;listen_port&#39;] = 8084</span></span>
<span class="line"><span>    ports:</span></span>
<span class="line"><span>      - &#39;8084:8084&#39;</span></span>
<span class="line"><span>      - &#39;8443:443&#39;</span></span>
<span class="line"><span>      - &#39;2222:22&#39;</span></span>
<span class="line"><span>    volumes:</span></span>
<span class="line"><span>      - &#39;./config:/etc/gitlab&#39;</span></span>
<span class="line"><span>      - &#39;./logs:/var/log/gitlab&#39;</span></span>
<span class="line"><span>      - &#39;./data:/var/opt/gitlab&#39;</span></span></code></pre></div><p>执行 <code>docker-compose up</code>，然后进入等待时间，等它下好了去通过自己设置的虚拟机的ip和端口号访问</p><p><img src="https://cdn.jsdelivr.net/gh/fqcto/images/blogs/picture/20211129160440.png" alt="GitLab 中文社区版"></p><p>如果安装过程中有报错权限问题，那么加上 <code>privileged: true</code></p><p>查看方式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>root@iZm5ebvlfc3n55vzckl9ifZ:# docker ps</span></span>
<span class="line"><span>CONTAINER ID        IMAGE                         COMMAND                  CREATED             STATUS                 PORTS                                                                         NAMES</span></span>
<span class="line"><span>ddc7d0e214ef        twang2218/gitlab-ce-zh        &quot;/assets/wrapper&quot;        30 hours ago        Up 6 hours (healthy)   80/tcp, 0.0.0.0:8084-&gt;8084/tcp, 0.0.0.0:2222-&gt;22/tcp, 0.0.0.0:8443-&gt;443/tcp   gitlab_web_1</span></span></code></pre></div><p>通过虚拟主机的 <code>ip</code> + <code>端口</code> 访问，此时需要设置管理员密码，账号为root，密码最少为8位。</p><p>登录成功后，如下：</p><p><img src="https://cdn.jsdelivr.net/gh/fqcto/images/blogs/picture/20211129160835.png" alt="项目创建"></p><h3 id="项目创建" tabindex="-1">项目创建 <a class="header-anchor" href="#项目创建" aria-label="Permalink to &quot;项目创建&quot;">​</a></h3><p>点击 <code>+</code> 号 =&gt; <code>新建项目</code></p><p><img src="https://cdn.jsdelivr.net/gh/fqcto/images/blogs/picture/20211129160952.png" alt="新建项目"></p><p>输入项目名称及描述信息，设置可见等级：私有，内部，公开。</p><p><img src="https://cdn.jsdelivr.net/gh/fqcto/images/blogs/picture/20211129161043.png" alt="新建项目规范"></p><p><strong>初始化项目</strong></p><p>我们可以选择通过增加一个 README 的方式来初始化项目，如下：</p><p><img src="https://cdn.jsdelivr.net/gh/fqcto/images/blogs/picture/20211129161205.png" alt="初始化README"></p><p><img src="https://cdn.jsdelivr.net/gh/fqcto/images/blogs/picture/20211129161233.png" alt="提交修改README"></p><p>创建项目的时候有一个问题，在自己最开始定义了端口号，创建项目的时候会没有端口号，这时候clone项目的时候会访问不了，这时候我们在最开始安装定义目录里面config目录下找到 <code>gitlab.rb</code>，编辑它，搜索 <code>external_url</code>，没有就添加 <code>external_url:主机ip+端口号</code>,有就修改就行了。这时候我们就可以去克隆项目了。当然我们也可以通过下面方法去把项目推送到gitlab上面：</p><p><img src="https://cdn.jsdelivr.net/gh/fqcto/images/blogs/picture/20211129161627.png" alt="git推送命令"></p><p><img src="https://cdn.jsdelivr.net/gh/fqcto/images/blogs/picture/20211129161741.png" alt="项目git面板"></p><h2 id="gitlab-runner" tabindex="-1">Gitlab-Runner <a class="header-anchor" href="#gitlab-runner" aria-label="Permalink to &quot;Gitlab-Runner&quot;">​</a></h2><h3 id="安装" tabindex="-1">安装 <a class="header-anchor" href="#安装" aria-label="Permalink to &quot;安装&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>sudo docker run -d --name gitlab-runner --restart always \\</span></span>
<span class="line"><span>  -v /home/gitlab-runner/config:/etc/gitlab-runner \\</span></span>
<span class="line"><span>  -v /var/run/docker.sock:/var/run/docker.sock \\</span></span>
<span class="line"><span>  gitlab/gitlab-runner:latest</span></span></code></pre></div><p>映射 <code>/var/run/docker.sock</code> 这个文件是为了让容器可以通过 <code>/var/run/docker.sock</code> 与 <code>Docker</code> 守护进程通信，管理其他 <code>Docker</code> 容器 <code>-v /home/gitlab-runner/config:/etc/gitlab-runner</code> 是将runner的配置文件映射到宿主机 <code>/home/gitlab-runner/config</code> 方便调整和查看配置</p><p>安装完成我们需要去注册 Gitlab-Runner</p><p>运行 <code>docker ps</code> 查看：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>root@iZm5ebvlfc3n55vzckl9ifZ:/home/docker/gitlab# docker ps</span></span>
<span class="line"><span>CONTAINER ID        IMAGE                         COMMAND                  CREATED             STATUS                 PORTS                                                                         NAMES</span></span>
<span class="line"><span>ed6c7a038263        gitlab/gitlab-runner:latest   &quot;/usr/bin/dumb-init …&quot;   24 hours ago        Up 24 hours                                                                                          gitlab-runner</span></span>
<span class="line"><span>ddc7d0e214ef        twang2218/gitlab-ce-zh        &quot;/assets/wrapper&quot;        30 hours ago        Up 6 hours (healthy)   80/tcp, 0.0.0.0:8084-&gt;8084/tcp, 0.0.0.0:2222-&gt;22/tcp, 0.0.0.0:8443-&gt;443/tcp   gitlab_web_1</span></span></code></pre></div><h3 id="注册" tabindex="-1">注册 <a class="header-anchor" href="#注册" aria-label="Permalink to &quot;注册&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>docker run --rm -v /srv/gitlab-runner/config:/etc/gitlab-runner gitlab/gitlab-runner register \\</span></span>
<span class="line"><span>  --non-interactive \\</span></span>
<span class="line"><span>  --executor &quot;docker&quot; \\</span></span>
<span class="line"><span>  --docker-image alpine:latest \\</span></span>
<span class="line"><span>  --url &quot;&quot; \\</span></span>
<span class="line"><span>  --registration-token &quot;&quot; \\</span></span>
<span class="line"><span>  --description &quot;first-register-runner&quot; \\</span></span>
<span class="line"><span>  --tag-list &quot;vue3-app&quot; \\</span></span>
<span class="line"><span>  --run-untagged=&quot;true&quot; \\</span></span>
<span class="line"><span>  --locked=&quot;false&quot; \\</span></span>
<span class="line"><span>  --access-level=&quot;not_protected&quot;</span></span></code></pre></div><p>注册需要输出 <code>url</code>, <code>token</code>, <code>描述</code>, <code>tag</code>, <code>执行器</code> 等，<code>url</code> 和 <code>token</code> 怎么来的呢?在设置 -&gt; CI/CD -&gt; Runner 里面，我这里面注册了一个专用的和共享的 <code>Runner</code>, 正常情况我们用专门 <code>Runner</code> 就可以了。共享版 <code>Runner</code> 是登陆 <code>root</code> 账户在头部小扳手图片里面的 <code>Runner</code> 得到 <code>url</code> 和 <code>token</code>, 然后去注册。这里面的tag值会在编写 <code>.gitlab-ci.yml</code> 时用到。</p><p><img src="https://cdn.jsdelivr.net/gh/fqcto/images/blogs/picture/20211129162650.png" alt="Runner配置"></p><h3 id="运行流水线" tabindex="-1">运行流水线 <a class="header-anchor" href="#运行流水线" aria-label="Permalink to &quot;运行流水线&quot;">​</a></h3><p>在项目根目录里面创建一个 <code>.gitlab-ci.yml</code>，编写代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>image: node:alpine</span></span>
<span class="line"><span></span></span>
<span class="line"><span>stages: # 分段</span></span>
<span class="line"><span>  - install</span></span>
<span class="line"><span>  - eslint</span></span>
<span class="line"><span>  - build</span></span>
<span class="line"><span>  - deploy</span></span>
<span class="line"><span></span></span>
<span class="line"><span>cache: # 缓存</span></span>
<span class="line"><span>  paths:</span></span>
<span class="line"><span>    - node_modules</span></span>
<span class="line"><span></span></span>
<span class="line"><span>job_install:</span></span>
<span class="line"><span>  tags:</span></span>
<span class="line"><span>    - vue3-app</span></span>
<span class="line"><span>  stage: install</span></span>
<span class="line"><span>  script:</span></span>
<span class="line"><span>    - npm install</span></span>
<span class="line"><span></span></span>
<span class="line"><span>job_build:</span></span>
<span class="line"><span>  tags:</span></span>
<span class="line"><span>    - vue3-app</span></span>
<span class="line"><span>  stage: build</span></span>
<span class="line"><span>  script:</span></span>
<span class="line"><span>    - npm run build</span></span></code></pre></div><p>参数说明：</p><ul><li>stages:pipeline的阶段列表，定义整个pipeline阶段</li><li>stage:定义某个job的所在阶段</li><li>image:指定一个基础Docker进行作为基础运行环境，比如:node,python,java</li><li>tags:用于指定Runner，tags的取值范围是在该项目可惜可见的runner tags中，也就是前面我们设置的那个tag</li><li>only/except:知道当前任务条件</li><li>when:实现在发生故障时仍能运行的作业</li><li>cache:讲当前工作环境目录中的一些文件，文件夹存储起来，用于在各个任务初始化的时候恢复</li><li>environment:指定部署相关任务的环境，并非真实环境，是对要部署到某环境的任务的归类。方便在gitlab上聚合以便进行回滚和重新部署操作</li><li>artifacts:保留文档。在每次 job 之前runner会清除未被 git 跟踪的文件。为了让编译或其他操作后的产物可以留存到后续使用，添加该参数并设置保留的目录，保留时间等。被保留的文件将被上传到gitlab以备后续使用。</li><li>dependencies:任务依赖。指定job的前置job。添加该参数后，可以获取到前置job的artifacts。注意如果前置 job 执行失败，导致没能生成artifacts，则 job 也会直接失败。</li></ul><p>编写好上面代码后推送到gitlab后就会执行里面的语句：</p><p><img src="https://cdn.jsdelivr.net/gh/fqcto/images/blogs/picture/20211129165647.png" alt="CI/CD作业"></p><h3 id="部署" tabindex="-1">部署 <a class="header-anchor" href="#部署" aria-label="Permalink to &quot;部署&quot;">​</a></h3><p>在项目中创建一个 <code>Dockerfile</code>，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>FROM node:latest as builder</span></span>
<span class="line"><span>WORKDIR /app</span></span>
<span class="line"><span>COPY  package.json</span></span>
<span class="line"><span>RUN npm install --registry=http://registry.npm.taobao.org</span></span>
<span class="line"><span>COPY ..</span></span>
<span class="line"><span>RUN npm run build</span></span>
<span class="line"><span></span></span>
<span class="line"><span>FROM nginx:latest</span></span>
<span class="line"><span>COPY --from=builder /app/dist /usr/share/nginx/html</span></span></code></pre></div><p><code>.gitlab-ci.yml</code> 修改如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>image: node:alpine</span></span>
<span class="line"><span></span></span>
<span class="line"><span>stages: # 分段</span></span>
<span class="line"><span>  - install</span></span>
<span class="line"><span>  - eslint</span></span>
<span class="line"><span>  - build</span></span>
<span class="line"><span>  - deploy</span></span>
<span class="line"><span></span></span>
<span class="line"><span>cache: # 缓存</span></span>
<span class="line"><span>  paths:</span></span>
<span class="line"><span>    - node_modules</span></span>
<span class="line"><span></span></span>
<span class="line"><span>job_install:</span></span>
<span class="line"><span>  tags:</span></span>
<span class="line"><span>    - vue3-app</span></span>
<span class="line"><span>  stage: install</span></span>
<span class="line"><span>  script:</span></span>
<span class="line"><span>    - npm install</span></span>
<span class="line"><span></span></span>
<span class="line"><span>job_build:</span></span>
<span class="line"><span>  tags:</span></span>
<span class="line"><span>    - vue3-app</span></span>
<span class="line"><span>  stage: build</span></span>
<span class="line"><span>  script:</span></span>
<span class="line"><span>    - npm run build</span></span>
<span class="line"><span></span></span>
<span class="line"><span>job_deploy:</span></span>
<span class="line"><span>    image: docker</span></span>
<span class="line"><span>    stage: deploy</span></span>
<span class="line"><span>    script:</span></span>
<span class="line"><span>      - docker build -t appimages</span></span>
<span class="line"><span>      - if [ $(docker ps -aq --filter name=app-container) ]; then docker rm -f app-container;fi</span></span>
<span class="line"><span>      - docker run -d -p 8082:80 --name app-container appimages</span></span></code></pre></div><p>if 语句判断：使用 docker 命令去搜索 docker 容器里面是否有一个name为 <code>app-container</code> 的容器，如果有就销毁，销毁掉是为了使用新的容器重新运行。</p><p>这里 <code>image:docker</code> 不写的话会报错：</p><p><img src="https://cdn.jsdelivr.net/gh/fqcto/images/blogs/picture/20211129170050.png" alt="image:docker"></p><p>代码推送后，流水线工作，到第三步就会出现以下报错：</p><p><img src="https://cdn.jsdelivr.net/gh/fqcto/images/blogs/picture/20211129170143.png" alt="流水线工作"></p><p><img src="https://cdn.jsdelivr.net/gh/fqcto/images/blogs/picture/20211129170247.png" alt="job_deploy报错"></p><p>解决办法，在runner配置文件中配置docker命令：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>&quot;/usr/bin/docker:/usr/bin/docker&quot;, &quot;/var/run/docker.sock:/var/run/docker.sock&quot;</span></span></code></pre></div><p>在gitlab-runner -&gt; config-vim config.toml，找到注册 runner 所对应的token，在 volumes 数组里面加入上面命令：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>concurrent = 1</span></span>
<span class="line"><span>check_interval = 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[session_server]</span></span>
<span class="line"><span>  session_timeout = 1800</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>[[runners]]</span></span>
<span class="line"><span>  name = &quot;first-register-runner&quot;</span></span>
<span class="line"><span>  url = &quot;&quot;</span></span>
<span class="line"><span>  token = &quot;&quot;</span></span>
<span class="line"><span>  executor = &quot;docker&quot;</span></span>
<span class="line"><span>  [runners.custom_build_dir]</span></span>
<span class="line"><span>  [runners.cache]</span></span>
<span class="line"><span>    [runners.cache.s3]</span></span>
<span class="line"><span>    [runners.cache.gcs]</span></span>
<span class="line"><span>    [runners.cache.azure]</span></span>
<span class="line"><span>  [runners.docker]</span></span>
<span class="line"><span>    tls_verify = false</span></span>
<span class="line"><span>    image = &quot;alpine:latest&quot;</span></span>
<span class="line"><span>    privileged = false</span></span>
<span class="line"><span>    disable_entrypoint_overwrite = false</span></span>
<span class="line"><span>    oom_kill_disable = false</span></span>
<span class="line"><span>    disable_cache = false</span></span>
<span class="line"><span>    volumes = [&quot;/cache&quot;,&quot;/usr/bin/docker:/usr/bin/docker&quot;, &quot;/var/run/docker.sock:/var/run/docker.sock&quot;]</span></span>
<span class="line"><span>    shm_size = 0</span></span></code></pre></div><p>我们再去重新运行失败的 jobs，这时候发现成功了：</p><p><img src="https://cdn.jsdelivr.net/gh/fqcto/images/blogs/picture/20211129170528.png" alt="运行成功"></p><p>然后通过前面注册的端口号去注册，可以正常访问项目。</p><h3 id="资料参考" tabindex="-1">资料参考 <a class="header-anchor" href="#资料参考" aria-label="Permalink to &quot;资料参考&quot;">​</a></h3><p><a href="https://zhuanlan.zhihu.com/p/184936276" target="_blank" rel="noreferrer">Gitlab-ci：从零开始的前端自动化部署 - 知乎</a></p><p><a href="https://www.cnblogs.com/yuyoho/p/13274533.html" target="_blank" rel="noreferrer">在CentOS上安装GitLab-CI以及运行Runner的方法步骤</a></p><p><a href="https://www.cnblogs.com/yuyoho/p/13273794.html" target="_blank" rel="noreferrer">在Gitlab上使用CI/CD实现程序自动化部署</a></p>`,85),i=[l];function t(c,o,r,d,g,u){return n(),a("div",null,i)}const m=s(e,[["render",t]]);export{b as __pageData,m as default};
