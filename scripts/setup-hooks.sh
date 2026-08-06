#!/bin/bash
# 一键启用团队共享 git hook（设计系统规范门禁）
# 用法：bash scripts/setup-hooks.sh
ROOT="$(git rev-parse --show-toplevel)"
git -C "$ROOT" config core.hooksPath scripts/git-hooks
echo "✅ 已启用 pre-commit 规范门禁（scripts/git-hooks/pre-commit）"
echo "   提交时自动校验 Web + 移动端 page-template.html，HIGH 违反即拦截。"
