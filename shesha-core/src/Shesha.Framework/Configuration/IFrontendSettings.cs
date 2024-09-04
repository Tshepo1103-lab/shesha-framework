﻿using Shesha.Domain;
using Shesha.Settings;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shesha.Configuration
{
    public interface IFrontendSettings: ISettingAccessors
    {
        /// <summary>
        /// Theme settings  
        /// </summary>
        [Display(Name = "Theme settings", Description = "", GroupName = "Frontend")]
        [Setting(SheshaSettingNames.ThemeSettings, isClientSpecific: true, editorFormName: "theme-settings")]
        ISettingAccessor<ThemeSettings> Theme { get; }

        /// <summary>
        /// Main menu settings  
        /// </summary>
        [Display(Name = "Main menu settings", Description = "", GroupName = "Frontend")]
        [Setting(SheshaSettingNames.MainMenuSettings, isClientSpecific: true, editorFormName: "main-menu-settings")]
        ISettingAccessor<MainMenuSettings> MainMenu { get; }

        /// <summary>
        /// Default URL  
        /// </summary>
        [Display(Name = "Default URL", Description = "This is the url the user should be redirected to if the user is not authenticated and does not specific a specific page", GroupName = "Frontend")]
        [Setting(SheshaSettingNames.DefaultUrl, isClientSpecific: true)]
        ISettingAccessor<string> DefaultUrl { get; }
    }
}