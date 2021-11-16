import { SanitizeHtmlPipe } from './sanitize-html-pipe.pipe';

describe('SanitizeHtmlPipePipe', () => {
  it('create an instance', () => {
    const pipe = new SanitizeHtmlPipe();
    expect(pipe).toBeTruthy();
  });
});
