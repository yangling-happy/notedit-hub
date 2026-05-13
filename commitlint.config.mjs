/**
 * Commitlint 配置：遵循 Conventional Commits 规范
 * 提交信息格式：<type>(<scope>): <subject>
 * 示例：feat(client): add note export to PDF
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
      ],
    ],
    'subject-case': [0],
    'subject-max-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 120],
  },
}
