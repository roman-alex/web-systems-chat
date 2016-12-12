import { ChatNgFbPage } from './app.po';

describe('chat-ng-fb App', function() {
  let page: ChatNgFbPage;

  beforeEach(() => {
    page = new ChatNgFbPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
