﻿using Abp.Domain.Repositories;
using FluentValidation;
using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Shesha.Extensions;

namespace Shesha.Domain
{
    /// <summary>
    /// A Front-end App represents the various front-end applications that build off this back-end. 
    /// For example, Admin Portal, Customer Portal, Customer Mobile App would be fairly typical examples.
    /// </summary>
    public class FrontEndApp : FullPowerEntity
    {
        /// <summary>
        /// Unique identifier of the application (key). This key is used for identification of the front-end app
        /// </summary>
        [StringLength(100)]
        public virtual string AppKey { get; set; }

        /// <summary>
        /// Name of the front-end app.
        /// </summary>
        [StringLength(100)]
        public virtual string Name { get; set; }

        /// <summary>
        /// Description of the Front-end application.
        /// </summary>
        public virtual string Description { get; set; }
    }

    public class FrontEndAppValidator : AbstractValidator<FrontEndApp>
    {
        private readonly IRepository<FrontEndApp, Guid> _repository;

        public FrontEndAppValidator(IRepository<FrontEndApp, Guid> repository)
        {
            _repository = repository;
            RuleFor(x => x.AppKey).NotEmpty().MustAsync(UniqueNameAsync).WithMessage("Application with application key '{PropertyValue}' already exists.");
        }

        private async Task<bool> UniqueNameAsync(FrontEndApp app, string appKey, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(appKey))
                return true;

            var alreadyExist = await _repository.GetAll().Where(m => m.AppKey.ToLower() == appKey.ToLower() && m.Id != app.Id).AnyAsync();
            return !alreadyExist;
        }
    }
}
