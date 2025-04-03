# Cloudflare Pages 部署文档

本教程将指导你如何将静态网站部署到 Cloudflare Pages。Cloudflare Pages 是一种用于部署静态网站和单页应用程序的平台，它具有全球 CDN、自动部署和免费 SSL 等功能。

## 前提条件

*   一个 Cloudflare 帐户 (需要绑定域名，没有域名可以先使用 *.cloudflare.dev 的二级域名)
*   一个 Git 仓库 (例如 GitHub, GitLab, Bitbucket)，用于存储你的网站代码
*   你的静态网站代码 (例如 HTML, CSS, JavaScript, 图片等)

## 步骤

1.  **准备你的代码仓库**

    *   将你的静态网站代码上传到你的 Git 仓库。
    *   确保仓库根目录下包含 `index.html` 文件 (或其他入口 HTML 文件)。
    *   如果你的网站依赖于构建步骤 (例如使用 Webpack, Parcel 等)，请确保你的构建脚本已正确配置，并且构建输出目录已设置为包含构建后的静态文件的目录。

2.  **登录 Cloudflare**

    *   访问 [Cloudflare 官网](https://www.cloudflare.com/) 并登录你的帐户。

3.  **创建 Pages 项目**

    *   在 Cloudflare 控制面板中，导航到 "Workers & Pages"。
    *   点击 "Create application"，然后选择 "Pages" 选项卡。
    *   点击 "Connect to Git".

4.  **连接你的 Git 仓库**

    *   选择你的 Git 提供商 (GitHub, GitLab)。
    *   如果这是你第一次连接 Cloudflare 到你的 Git 提供商，你可能需要授权 Cloudflare 访问你的仓库。
    *   选择包含你的网站代码的仓库。
    *   点击 "Begin setup".

5.  **配置构建设置**

    *   **Project name**: 为你的项目选择一个名称。这个名称将用于生成你的 Cloudflare Pages 子域名 (`your-project-name.pages.dev`)。
    *   **Production branch**: 选择你要部署的分支 (通常是 `main` 或 `master`)。
    *   **Framework preset**: 如果你的项目使用了某个流行的静态网站生成器 (例如 Next.js, Gatsby, Hugo)，你可以选择相应的预设。如果你的项目是纯 HTML/CSS/JavaScript，选择 "None"。
    *   **Build command**:  如果你的项目需要构建步骤，在此处输入构建命令。例如，如果你的项目使用 `npm run build` 构建，则在此处输入 `npm run build`。对于纯静态网站，可以留空或输入 `echo "No build needed"`.
    *   **Build output directory**:  输入你的构建输出目录。这是包含构建后的静态文件的目录。如果你的 `index.html` 文件位于仓库根目录，则输入 `/`。如果你的文件位于某个子目录 (例如 `public` 或 `dist`)，则输入该子目录的名称。
    *   **Environment variables (optional)**:  如果你的构建过程需要任何环境变量，可以在此处添加。

6.  **部署你的网站**

    *   点击 "Save and deploy"。
    *   Cloudflare Pages 将自动从你的 Git 仓库拉取代码，执行构建命令 (如果已配置)，并将构建后的静态文件部署到 Cloudflare 的全球 CDN。

7.  **访问你的网站**

    *   部署完成后，Cloudflare Pages 将提供一个 `*.pages.dev` 的子域名供你访问你的网站。
    *   你也可以将你的自定义域名绑定到你的 Cloudflare Pages 项目。

## 高级配置

*   **自定义域名**:  在 Cloudflare 控制面板中，导航到你的 Pages 项目，然后选择 "Custom domains" 选项卡。按照说明将你的自定义域名添加到 Cloudflare Pages。
*   **环境变量**:  在 Cloudflare 控制面板中，导航到你的 Pages 项目，然后选择 "Settings" -> "Environment variables" 选项卡。在此处添加你的环境变量。
*   **部署钩子**:  Cloudflare Pages 支持部署钩子，允许你在每次代码推送到你的 Git 仓库时自动触发部署。
*   **回滚**: Cloudflare Pages 会保存你网站的历史版本，允许你轻松地回滚到以前的版本。

## 故障排除

*   **构建失败**:  检查你的构建命令和构建输出目录是否正确配置。查看构建日志以获取更多信息。
*   **网站无法访问**:  检查你的 DNS 设置是否正确配置，并且你的自定义域名已正确绑定到 Cloudflare Pages。
*   **HTTPS 问题**:  Cloudflare Pages 自动提供免费的 SSL 证书。确保你的网站已配置为使用 HTTPS。

## 总结

通过本教程，你应该能够成功地将你的静态网站部署到 Cloudflare Pages。Cloudflare Pages 提供了一种简单、快速且可靠的方式来托管你的静态网站，并具有许多有用的功能，例如全球 CDN、自动部署和免费 SSL。
