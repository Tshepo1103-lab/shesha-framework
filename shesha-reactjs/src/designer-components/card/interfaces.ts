import { IConfigurableFormComponent } from '@/providers/form/models';

interface ICardContent {
  id: string;
  components?: IConfigurableFormComponent[];
}

export interface ICardComponentProps extends IConfigurableFormComponent {
  className?: string;
  content?: ICardContent;
  header?: ICardContent;
  hideHeading?: boolean;
  hideWhenEmpty?: boolean;
}
