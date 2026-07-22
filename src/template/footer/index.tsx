import React from 'react';
import { SiteConfig, Game } from '../../types';
import FooterStyle1 from './FooterStyle1';
import FooterStyle2 from './FooterStyle2';
import FooterStyle3 from './FooterStyle3';
import FooterStyle4 from './FooterStyle4';

interface FooterProps {
  config: SiteConfig;
  games: Game[];
  onNavigate: (path: string) => void;
  onSelectGame?: (game: Game) => void;
}

export default function DynamicFooter(props: FooterProps) {
  const activeFooter = props.config.activeFooterTemplate || 'style-1';
  const websiteTemplate = props.config.activeWebsiteTemplate || 'classic';

  if (activeFooter === 'style-2' || activeFooter === 'cyberpunk' || (activeFooter === 'style-1' && websiteTemplate === 'cyberpunk')) {
    return <FooterStyle2 {...props} />;
  }

  if (activeFooter === 'style-3' || activeFooter === 'esports' || (activeFooter === 'style-1' && websiteTemplate === 'esports')) {
    return <FooterStyle3 {...props} />;
  }

  if (activeFooter === 'style-4' || activeFooter === 'minimal' || (activeFooter === 'style-1' && websiteTemplate === 'retro')) {
    return <FooterStyle4 {...props} />;
  }

  return <FooterStyle1 {...props} />;
}
